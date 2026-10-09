import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { SectionRail } from "@/components/layout/section-rail"

/** Fixed UI (progress bar, top dock, section rail), loaded after the first paint. */
export default function Chrome() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <SectionRail />
    </>
  )
}
