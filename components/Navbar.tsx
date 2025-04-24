"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Globe className="h-5 w-5" />
            <span>TPN Lease Portal</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/" className={pathname === "/" ? "font-medium" : "text-muted-foreground"}>
              Home
            </Link>
            <Link href="/monitor" className={pathname === "/monitor" ? "font-medium" : "text-muted-foreground"}>
              Monitor
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/monitor">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Activity className="h-4 w-4" />
              Validator Status
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
