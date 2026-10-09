import { animals } from "@/data/animals"
import { certificates } from "@/data/certificates"
import { milestones } from "@/data/milestones"

// Temporary shell: sections are added phase by phase.
function App() {
  const photos = milestones.reduce((n, m) => n + m.photos.length, 0)
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <p>
        Portafolio en construcción · {milestones.length} hitos ({photos} fotos) · {animals.length} ilustraciones ·{" "}
        {certificates.length} certificados
      </p>
    </main>
  )
}

export default App
