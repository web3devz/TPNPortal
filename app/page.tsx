import Globe from "@/components/Globe"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Globe...</div>}>
          <Globe />
        </Suspense>
      </div>
    </main>
  )
}
