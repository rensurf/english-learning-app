"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { getStats } from "@/lib/actions"

interface StatsData {
  total_phrases: number
  reviewed_today: number
  common_mistakes: Array<{
    pattern: string
    count: number
  }>
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
    } finally {
      setIsLoading(false)
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
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const maxCount = Math.max(...(stats.common_mistakes?.map((m) => m.count) || [1]))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Your Progress</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Phrases</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_phrases}</div>
            <p className="text-xs text-muted-foreground mt-1">Phrases learned so far</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed Today</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reviewed_today}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
          </CardContent>
        </Card>
      </div>

      {stats.common_mistakes && stats.common_mistakes.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="size-5 text-muted-foreground" />
            <CardTitle>Common Mistake Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.common_mistakes.map((mistake, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{mistake.pattern}</span>
                  <span className="text-muted-foreground">{mistake.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(mistake.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
