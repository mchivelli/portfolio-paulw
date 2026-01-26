import { projects } from "@/app/data/projects"
import { SideNav } from "@/components/side-nav"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectId = parseInt(id)
    const project = projects.find((p) => p.id === projectId)

    if (!project) {
        notFound()
    }

    return (
        <main className="relative min-h-screen">
            <SideNav />
            <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
            <AnimatedNoise opacity={0.03} />

            <div className="relative z-10 pt-32 pb-20 pl-6 md:pl-28 pr-6 md:pr-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/#work"
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-6 group"
                    >
                        <BitmapChevron className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>

                    <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                        {project.medium || "Project"}
                    </span>
                    <h1 className="font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight leading-none mb-6">
                        {project.title}
                    </h1>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {project.tech.map((t, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 border border-border/40 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    <p className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl border-l-2 border-accent/50 pl-6">
                        {project.longDescription || project.description}
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-6 mb-16">
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
                    >
                        GitHub Repository
                        <BitmapChevron className="group-hover:rotate-45 transition-transform" />
                    </a>
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
                        >
                            Live Demo
                            <BitmapChevron className="group-hover:rotate-45 transition-transform" />
                        </a>
                    )}
                </div>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-tight mb-8 text-foreground/90">
                                Key Features
                            </h2>
                            <ul className="grid gap-4">
                                {project.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-accent/50 group-hover:bg-accent transition-colors" />
                                        <span className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Image Placeholder or Preview */}
                        <div className="relative aspect-video border border-border/40 bg-black/20 overflow-hidden group">
                            {project.image && (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                                />
                            )}
                            <div className="absolute inset-0 border border-accent/20 m-2" />
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
