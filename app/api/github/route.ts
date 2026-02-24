import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const username = process.env.GITHUB_USERNAME || 'mchivelli';
    const { searchParams } = new URL(request.url);
    const listAll = searchParams.get('list') === 'true';

    try {
        // Fetch repos (all if listing, otherwise limited)
        const perPage = listAll ? 100 : 50;
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&type=owner`,
            {
                headers: { Accept: 'application/vnd.github+json' },
                next: { revalidate: 300 }, // cache 5 min
            }
        );

        if (!reposRes.ok) {
            throw new Error(`GitHub API error: ${reposRes.status}`);
        }

        const allRepos = await reposRes.json();

        // If just listing repos for selection, return them
        if (listAll) {
            return NextResponse.json({
                repos: allRepos.map((repo: any) => ({
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    url: repo.html_url,
                    updatedAt: repo.updated_at,
                }))
            });
        }

        // Get selected repos from settings
        const fs = await import('fs');
        const path = await import('path');
        const settingsPath = path.join(process.cwd(), 'app', 'api', 'admin', 'data', 'settings.json');
        let selectedRepoNames: string[] = [];

        try {
            const settingsData = fs.readFileSync(settingsPath, 'utf-8');
            const settings = JSON.parse(settingsData);
            selectedRepoNames = settings.github?.selectedRepos || [];
        } catch {
            // Settings not found, show top 6
        }

        // Filter repos based on selection or show top 6
        let repos = allRepos;
        if (selectedRepoNames.length > 0) {
            repos = allRepos.filter((repo: any) => selectedRepoNames.includes(repo.name));
        } else {
            repos = allRepos.slice(0, 6);
        }

        // Fetch recent public events
        const eventsRes = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=15`,
            {
                headers: { Accept: 'application/vnd.github+json' },
                next: { revalidate: 300 },
            }
        );

        const events = eventsRes.ok ? await eventsRes.json() : [];

        // Map repos to a clean format
        const repoData = repos.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
        }));

        // Map events to a clean format
        const eventData = events
            .filter((e: any) => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(e.type))
            .slice(0, 10)
            .map((e: any) => ({
                type: e.type,
                repo: e.repo?.name?.split('/')[1] || e.repo?.name,
                createdAt: e.created_at,
                payload: {
                    commits: e.type === 'PushEvent' ? e.payload?.commits?.length || 0 : undefined,
                    action: e.payload?.action,
                    ref: e.payload?.ref,
                    refType: e.payload?.ref_type,
                },
            }));

        return NextResponse.json({
            repos: repoData,
            events: eventData,
            username,
        });
    } catch (error: any) {
        console.error('GitHub API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch GitHub data' },
            { status: 500 }
        );
    }
}
