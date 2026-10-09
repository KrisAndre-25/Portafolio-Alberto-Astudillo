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
      className="block size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border transition-transform hover:scale-105"
    >
      <img src="/assets/logo/logo-192.png" alt="Alberto Astudillo" width={44} height={44} className="size-full" />
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
      desktopClassName="fixed inset-x-0 bottom-5 z-50 w-fit"
      mobileClassName="fixed right-4 bottom-4 z-50"
    />
  )
}
