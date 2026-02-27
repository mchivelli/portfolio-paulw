import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin — Portfolio",
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout" style={{ cursor: 'auto' }}>
      <style>{`
        .admin-layout, .admin-layout * { cursor: auto !important; }
        .noise-overlay { display: none !important; }
      `}</style>
      {children}
    </div>
  )
}
