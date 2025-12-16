"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { getWeaknesses } from "@/lib/actions"
import { Button } from "@/components/ui/button"

interface Weakness {
  pattern: string
  count: number
  examples: Array<{
    original: string
    corrected: string
  }>
}

export function Weaknesses() {
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWeaknesses()
  }, [])

  const loadWeaknesses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getWeaknesses(10)
      setWeaknesses(data.weaknesses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weaknesses")
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

  if (weaknesses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No common error patterns found yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Common Error Patterns</h2>
      {weaknesses.map((weakness, index) => (
        <Card key={index}>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{weakness.pattern}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {weakness.count} {weakness.count === 1 ? "occurrence" : "occurrences"}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                {expandedIndex === index ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </Button>
            </div>
          </CardHeader>
          {expandedIndex === index && (
            <CardContent className="space-y-3">
              {weakness.examples.map((example, i) => (
                <div key={i} className="border-l-2 border-destructive pl-4">
                  <p className="text-sm text-muted-foreground line-through">{example.original}</p>
                  <p className="text-sm text-foreground font-medium mt-1">→ {example.corrected}</p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
