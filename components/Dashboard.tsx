"use client"

import { useState, useEffect } from "react"
import { getValidatorMetrics } from "@/lib/tpn-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getValidatorMetrics()
      setMetrics(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching validator metrics:", err)
      setError(err.message || "Failed to fetch validator metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()

    // Poll every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (latency) => {
    if (latency === Number.POSITIVE_INFINITY) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-4 w-4" />
          Offline
        </Badge>
      )
    } else if (latency > 500) {
      return (
        <Badge
          variant="outline"
          className="gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        >
          <AlertCircle className="h-4 w-4" />
          Slow
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          Online
        </Badge>
      )
    }
  }

  const formatLatency = (latency) => {
    return latency === Number.POSITIVE_INFINITY ? "—" : `${latency} ms`
  }

  const getBestValidator = () => {
    if (!metrics.length) return null
    const best = metrics[0]
    return best.latency === Number.POSITIVE_INFINITY ? null : best
  }

  const bestValidator = getBestValidator()

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validator Status</CardTitle>
              <CardDescription>Real-time performance metrics for TPN validators</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={loading} className="gap-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Best Validator</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && metrics.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bestValidator ? (
                  <div className="flex flex-col gap-1">
                    <div className="text-2xl font-bold">{bestValidator.host}</div>
                    <div className="text-sm text-muted-foreground">
                      UID: {bestValidator.uid} • Latency: {formatLatency(bestValidator.latency)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No validators currently available</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Validator Status</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && metrics.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics.filter((m) => m.latency !== Number.POSITIVE_INFINITY).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics.filter((m) => m.latency !== Number.POSITIVE_INFINITY && m.latency <= 500).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Healthy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics.filter((m) => m.latency === Number.POSITIVE_INFINITY).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Offline</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {lastUpdated && (
            <div className="text-xs text-muted-foreground text-right mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validator List */}
      <div className="grid gap-4">
        <h2 className="text-xl font-bold">Validator Latencies</h2>

        {loading && metrics.length === 0 ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : metrics.length > 0 ? (
          metrics.map((validator) => (
            <Card key={validator.uid} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{validator.host}</span>
                    {getStatusBadge(validator.latency)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">UID: {validator.uid}</div>
                </div>

                <div className="flex items-center gap-4 md:w-1/3">
                  <div className="w-full max-w-[200px]">
                    {validator.latency !== Number.POSITIVE_INFINITY && (
                      <Progress value={Math.max(0, 100 - validator.latency / 10)} className="h-2" />
                    )}
                  </div>
                  <div className="text-sm font-medium w-20 text-right">{formatLatency(validator.latency)}</div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-muted-foreground">No validator data available</Card>
        )}
      </div>
    </div>
  )
}
