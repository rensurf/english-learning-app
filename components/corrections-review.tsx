"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getReviewCorrections } from "@/lib/actions"
import type { Correction } from "@/lib/types"

export function CorrectionsReview() {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [limit, setLimit] = useState(20)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadCorrections()
  }, [limit, order])

  const loadCorrections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewCorrections(limit, 'created_at', order)
      setCorrections(data.corrections || [])
      setCurrentIndex(0)
      setReviewedCount(0)
      setIsRevealed(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load corrections")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setReviewedCount(reviewedCount + 1)
    if (currentIndex < corrections.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsRevealed(false)
    } else {
      setCurrentIndex(corrections.length)
    }
  }

  if (isLoading) {
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
          <div className="mt-4 flex justify-center">
            <Button onClick={loadCorrections}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (corrections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No corrections to review right now.</p>
        </CardContent>
      </Card>
    )
  }

  if (currentIndex >= corrections.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Review Complete! 🎉</h2>
            <p className="text-muted-foreground">You reviewed {reviewedCount} corrections today.</p>
          </div>
          <Button
            onClick={() => {
              setCurrentIndex(0)
              setReviewedCount(0)
              setIsRevealed(false)
              loadCorrections()
            }}
          >
            Review Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentCorrection = corrections[currentIndex]
  const progress = `${reviewedCount} / ${corrections.length} corrections reviewed`

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="size-5" />
              Review Settings
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="review-limit">Number of corrections</Label>
                <Input
                  id="review-limit"
                  type="number"
                  min="1"
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-order">Order</Label>
                <Select value={order} onValueChange={(value) => setOrder(value as 'asc' | 'desc')}>
                  <SelectTrigger id="review-order">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">{progress}</div>

      <div className="mx-auto max-w-2xl">
        <Card className="min-h-[400px]">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
            <div className="w-full space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Original Text:</p>
                <h2 className="text-2xl font-bold text-foreground mb-4 text-balance">
                  {currentCorrection.original_text}
                </h2>
              </div>

              {isRevealed ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Corrected:</p>
                    <p className="text-xl font-semibold text-foreground">
                      {currentCorrection.corrected_text}
                    </p>
                  </div>

                  {currentCorrection.feedback && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Feedback:</p>
                      <p className="text-sm italic">{currentCorrection.feedback}</p>
                    </div>
                  )}

                  {currentCorrection.error_pattern && (
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                        {currentCorrection.error_pattern}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Click below to see the correction</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-3">
        {!isRevealed ? (
          <Button size="lg" onClick={() => setIsRevealed(true)}>
            Show Correction
          </Button>
        ) : (
          <Button size="lg" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
