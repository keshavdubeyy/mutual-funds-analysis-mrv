import { redirect } from "next/navigation"

// Findings used to live at "/" as a single page with tabs. It's now three separate pages
// under /findings/* (matching Dataset and Method and Research Plan's own routing) — this
// keeps the old root URL working rather than breaking existing bookmarks/links.
export default function Home() {
  redirect("/findings/who-is-in-sample")
}
