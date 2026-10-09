import { cn } from "@/lib/utils"

/**
 * Rotating low-poly 3D tree (from referencias/tree-loader.tsx), rebuilt with
 * CSS custom properties and theme colours. Decorative; still for reduced motion.
 * `size` scales the whole tree (1 = original 50px crown).
 */
export function Tree3D({ className, size = 1 }: { className?: string; size?: number }) {
  const four = [0, 1, 2, 3]
  return (
    <div aria-hidden="true" className={cn("tree3d-wrap", className)} style={{ "--tree-scale": size } as React.CSSProperties}>
      <div className="tree3d">
        {four.map((x) => (
          <div key={x} className="tree3d-branch" style={{ "--x": x } as React.CSSProperties}>
            {four.map((i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
        ))}
        <div className="tree3d-stem">
          {four.map((i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <span className="tree3d-shadow" />
      </div>
    </div>
  )
}
