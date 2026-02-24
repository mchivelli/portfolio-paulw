import { NextResponse } from 'next/server';

const CLICKUP_API = 'https://api.clickup.com/api/v2';

async function clickupFetch(endpoint: string, token: string) {
    const res = await fetch(`${CLICKUP_API}${endpoint}`, {
        headers: { Authorization: token },
        next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) throw new Error(`ClickUp API ${res.status}: ${await res.text()}`);
    return res.json();
}

export async function GET(request: Request) {
    const token = process.env.CLICKUP_API_KEY;

    if (!token) {
        return NextResponse.json(
            { error: 'CLICKUP_API_KEY not configured' },
            { status: 500 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const listWorkspaces = searchParams.get('list') === 'true';

        // Step 1: Get workspaces (teams)
        const teamsData = await clickupFetch('/team', token);
        const teams = teamsData.teams || [];

        if (teams.length === 0) {
            return NextResponse.json({ workspaces: [], tasks: [], stats: {} });
        }

        // If just listing workspaces, return them
        if (listWorkspaces) {
            return NextResponse.json({
                workspaces: teams.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                }))
            });
        }

        // Get selected workspace from settings or use first one
        const fs = await import('fs');
        const path = await import('path');
        const settingsPath = path.join(process.cwd(), 'app', 'api', 'admin', 'data', 'settings.json');
        let selectedWorkspaceId = null;

        try {
            const settingsData = fs.readFileSync(settingsPath, 'utf-8');
            const settings = JSON.parse(settingsData);
            selectedWorkspaceId = settings.clickup?.workspaceId;
        } catch {
            // Settings not found, use first workspace
        }

        const teamId = selectedWorkspaceId || teams[0].id;

        // Step 2: Get spaces in the first workspace
        const spacesData = await clickupFetch(`/team/${teamId}/space?archived=false`, token);
        const spaces = spacesData.spaces || [];

        // Step 3: Gather tasks from all lists across all spaces
        let allTasks: any[] = [];

        for (const space of spaces.slice(0, 5)) {
            try {
                // Get folders in space
                const foldersData = await clickupFetch(`/space/${space.id}/folder?archived=false`, token);
                const folders = foldersData.folders || [];

                // Get folderless lists
                const folderlessData = await clickupFetch(`/space/${space.id}/list?archived=false`, token);
                const folderlessLists = folderlessData.lists || [];

                // Collect all lists
                const allLists = [
                    ...folderlessLists,
                    ...folders.flatMap((f: any) => f.lists || []),
                ];

                // Fetch tasks from each list (limited)
                for (const list of allLists.slice(0, 10)) {
                    try {
                        const tasksData = await clickupFetch(
                            `/list/${list.id}/task?archived=false&page=0&order_by=updated&reverse=true&subtasks=false&include_closed=true`,
                            token
                        );
                        allTasks.push(
                            ...(tasksData.tasks || []).map((t: any) => ({
                                id: t.id,
                                name: t.name,
                                status: t.status?.status || 'unknown',
                                statusColor: t.status?.color,
                                priority: t.priority?.priority || null,
                                dueDate: t.due_date,
                                dateCreated: t.date_created,
                                dateUpdated: t.date_updated,
                                dateClosed: t.date_closed,
                                timeSpent: t.time_spent || 0,
                                list: list.name,
                                space: space.name,
                                tags: (t.tags || []).map((tag: any) => tag.name),
                            }))
                        );
                    } catch {
                        // skip inaccessible lists
                    }
                }
            } catch {
                // skip inaccessible spaces
            }
        }

        // Step 4: Compute productivity stats
        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

        const closedTasks = allTasks.filter(t =>
            t.status?.toLowerCase() === 'closed' || t.status?.toLowerCase() === 'complete' || t.status?.toLowerCase() === 'done'
        );
        const closedThisWeek = closedTasks.filter(t => t.dateClosed && parseInt(t.dateClosed) > oneWeekAgo);
        const closedThisMonth = closedTasks.filter(t => t.dateClosed && parseInt(t.dateClosed) > oneMonthAgo);

        const inProgress = allTasks.filter(t =>
            t.status?.toLowerCase() === 'in progress' || t.status?.toLowerCase() === 'in review'
        );

        const totalTimeSpent = allTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

        const stats = {
            totalTasks: allTasks.length,
            completedTotal: closedTasks.length,
            completedThisWeek: closedThisWeek.length,
            completedThisMonth: closedThisMonth.length,
            inProgress: inProgress.length,
            totalTimeTrackedMs: totalTimeSpent,
            totalTimeTrackedHours: Math.round(totalTimeSpent / 3600000 * 10) / 10,
            spaces: spaces.map((s: any) => s.name),
        };

        // Return recent tasks (last 20 updated) + stats
        const recentTasks = allTasks
            .sort((a, b) => parseInt(b.dateUpdated || '0') - parseInt(a.dateUpdated || '0'))
            .slice(0, 20);

        return NextResponse.json({
            stats,
            recentTasks,
            workspaceName: teams[0].name,
        });
    } catch (error: any) {
        console.error('ClickUp API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch ClickUp data' },
            { status: 500 }
        );
    }
}
