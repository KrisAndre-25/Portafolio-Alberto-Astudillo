import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock"
import { useA11yTheme } from "@/hooks/use-a11y-theme"
import { useActiveSection } from "@/hooks/use-active-section"
import { SECTIONS } from "@/config/sections"

const SECTION_IDS = SECTIONS.map((s) => s.id)

function Logo() {
  return (
    <a
      href="#inicio"
      data-no-underline
      className="relative block size-12 shrink-0 rounded-full bg-bone p-0.5 shadow-[0_0_0_3px_color-mix(in_oklch,var(--sand)_55%,transparent),0_0_28px_-4px_color-mix(in_oklch,var(--sand)_60%,transparent)] transition-transform duration-300 hover:scale-110 md:size-[3.25rem] contrast:shadow-[0_0_0_2px_var(--foreground)]"
    >
      <img src="/assets/logo/logo-192.png" alt="Alberto Astudillo" width={52} height={52} className="size-full rounded-full" />
    </a>
  )
}

/** Floating dock: logo, one item per section and the contrast toggle. */
export function Navbar() {
  const active = useActiveSection(SECTION_IDS)
  const { contrast, toggle } = useA11yTheme()

  const items: DockItem[] = [
    ...SECTIONS.map(({ id, title, Icon }) => ({
      title,
      href: `#${id}`,
      active: active === id,
      icon: <Icon className="size-full" stroke={1.6} />,
    })),
    {
      title: "Modo alto contraste / daltonismo",
      onClick: toggle,
      pressed: contrast,
      icon: contrast ? <IconEyeOff className="size-full" stroke={1.6} /> : <IconEye className="size-full" stroke={1.6} />,
    },
  ]

  return (
    <FloatingDock
      items={items}
      leading={<Logo />}
      desktopClassName="fixed inset-x-0 top-4 z-50 w-fit"
      mobileClassName="fixed top-3 right-3 z-50"
    />
  )
}
