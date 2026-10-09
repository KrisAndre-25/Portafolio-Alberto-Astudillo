import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock"
import { useA11yTheme } from "@/hooks/use-a11y-theme"
import { useActiveSection } from "@/hooks/use-active-section"
import { SECTIONS } from "@/config/sections"
import { asset } from "@/lib/asset"

const SECTION_IDS = SECTIONS.map((s) => s.id)

function Logo() {
  return (
    <a
      href="#inicio"
      data-no-underline
      className="relative block size-11 shrink-0 rounded-full border-2 border-sand/70 bg-bone p-1 transition-transform duration-300 hover:scale-105 contrast:border-foreground"
    >
      <img src={asset("/assets/logo/logo-128.webp")} alt="Alberto Astudillo" width={44} height={44} className="size-full object-contain" />
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
