"use client"

import { useState } from "react"
import { createLease } from "@/lib/tpn-client"
import { QRCodeSVG } from "qrcode.react"
import { Download, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LeaseModal({ country, countryName, onClose }) {
  const [minutes, setMinutes] = useState("5")
  const [loading, setLoading] = useState(false)
  const [leaseData, setLeaseData] = useState(null)
  const [error, setError] = useState(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      const { config, expiresAt } = await createLease(country, Number.parseInt(minutes))

      // Generate QR code data
      const payload = `data:application/wireguard;charset=utf-8,${encodeURIComponent(config)}`

      setLeaseData({
        config,
        expiresAt,
        qrData: payload,
      })

      // Auto-download
      const blob = new Blob([config], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `tpn-${country}.conf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error creating lease:", err)
      setError(err.message || "Failed to create lease. Please try again or select a different country.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAgain = () => {
    if (!leaseData) return

    const blob = new Blob([leaseData.config], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tpn-${country}.conf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatExpiryTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create VPN Lease - {countryName}</DialogTitle>
          <DialogDescription>
            Select a lease duration to create a WireGuard configuration for this region.
          </DialogDescription>
        </DialogHeader>

        {!leaseData ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Lease Duration</Label>
              <Select value={minutes} onValueChange={setMinutes}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="grid gap-4 py-4 items-center justify-items-center">
            <Card className="p-4 w-full max-w-xs">
              <QRCodeSVG value={leaseData.qrData} size={200} className="mx-auto" includeMargin={true} />
            </Card>

            <div className="text-center text-sm">
              <p>Scan this QR code with your WireGuard app</p>
              <p className="text-muted-foreground mt-1">Expires: {formatExpiryTime(leaseData.expiresAt)}</p>
            </div>

            <Button variant="outline" className="gap-2" onClick={handleDownloadAgain}>
              <Download className="h-4 w-4" />
              Download Config Again
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {!leaseData ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create Lease</>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="ml-auto gap-2">
              <Check className="h-4 w-4" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
