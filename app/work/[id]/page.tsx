import { projects } from "@/app/data/projects"
import { SideNav } from "@/components/side-nav"
import { AnimatedNoise } from "@/components/animated-noise"
import { CaseStudy } from "@/components/case-study"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    return projects.map((project) => ({
        id: project.id.toString(),
    }))
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = projects.find((p) => p.id === parseInt(id))

    if (!project) {
        notFound()
    }

    return (
        <main className="relative min-h-screen overflow-x-clip">
            <SideNav />
            <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
            <AnimatedNoise opacity={0.03} />
            {/* language handled client-side inside CaseStudy */}
            <CaseStudy project={project} />
        </main>
    )
}
