import { redirect } from "next/navigation"

// Findings used to live at "/" as a single page with tabs, then briefly at /findings/* — it's
// now "Who is in our sample?" as its own top-level page at /who-is-in-sample (no more
// "Findings" wrapper), with the Analysis page's 9 topics split across /understanding-the-user,
// /understanding-the-barriers, and /reaching-and-engaging. This keeps the old root URL working
// rather than breaking existing bookmarks/links.
export default function Home() {
  redirect("/who-is-in-sample")
}
