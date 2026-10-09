import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"

/** Fixed UI (progress bar + dock), loaded after the first paint. */
export default function Chrome() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
    </>
  )
}
