import Dashboard from "@/components/Dashboard"
import { Suspense } from "react"

export default function MonitorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Validator Monitoring Dashboard</h1>
      <Suspense fallback={<div>Loading dashboard metrics...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}
