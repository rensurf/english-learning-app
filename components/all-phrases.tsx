"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getAllPhrases } from "@/lib/actions"
import type { Phrase } from "@/lib/types"

export function AllPhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPhrases()
  }, [])

  const loadPhrases = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllPhrases(50)
      setPhrases(data.phrases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phrases")
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Phrases</h2>
      {phrases.map((phrase) => (
        <Card key={phrase.phrase_id}>
          <CardHeader>
            <CardTitle className="text-xl">{phrase.english}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-2">{phrase.japanese}</p>
            {phrase.context && <p className="text-sm text-muted-foreground italic">{phrase.context}</p>}
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span>Queries: {phrase.query_count}</span>
              {phrase.reviewed_at && <span>Last reviewed: {new Date(phrase.reviewed_at).toLocaleDateString()}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
