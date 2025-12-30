"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCorrections } from "@/lib/actions"
import { RefreshButton } from "@/components/refresh-button"
import type { Correction } from "@/lib/types"

function CorrectionCard({ correction }: { correction: Correction }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Correction</CardTitle>
          <span className="text-xs text-muted-foreground">
            {new Date(correction.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Original:</p>
            <p className="text-base text-foreground line-through opacity-70">{correction.original_text}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Corrected:</p>
            <p className="text-base text-foreground font-semibold">{correction.corrected_text}</p>
          </div>
          {correction.feedback && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Feedback:</p>
              <p className="text-sm text-muted-foreground italic">{correction.feedback}</p>
            </div>
          )}
          {correction.error_pattern && (
            <div className="mt-3 pt-3 border-t">
              <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                {correction.error_pattern}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AllCorrections() {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(50)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  const loadCorrections = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCorrections(limit, 'created_at', order)
      setCorrections(data.corrections || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load corrections")
    } finally {
      setIsLoading(false)
    }
  }, [limit, order])

  useEffect(() => {
    loadCorrections()
  }, [loadCorrections])

  if (isLoading && corrections.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">All Corrections</h2>
        <RefreshButton onRefresh={loadCorrections} isLoading={isLoading} />
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Number of corrections</Label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="500"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Select value={order} onValueChange={(value) => setOrder(value as 'asc' | 'desc')}>
                <SelectTrigger id="order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {corrections.length} corrections
      </div>

      {corrections.map((correction) => (
        <CorrectionCard key={correction.correction_id} correction={correction} />
      ))}
    </div>
  )
}
