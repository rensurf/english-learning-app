"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { getAllPhrases } from "@/lib/actions"
import { RefreshButton } from "@/components/refresh-button"
import type { Phrase } from "@/lib/types"

function PhraseCard({ phrase }: { phrase: Phrase }) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{phrase.japanese}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isRevealed ? (
            <>
              <p className="text-lg font-semibold text-foreground">{phrase.english}</p>
              {phrase.context && <p className="text-sm text-muted-foreground italic">{phrase.context}</p>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRevealed(false)}
                className="w-full"
              >
                <EyeOff className="size-4 mr-2" />
                Hide Answer
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsRevealed(true)}
              className="w-full"
            >
              <Eye className="size-4 mr-2" />
              Show English Answer
            </Button>
          )}
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground border-t pt-3">
            <span>Queries: {phrase.query_count}</span>
            {phrase.reviewed_at && <span>Last reviewed: {new Date(phrase.reviewed_at).toLocaleDateString()}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AllPhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPhrases = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    loadPhrases()
  }, [loadPhrases])

  if (isLoading && phrases.length === 0) {
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Recent Phrases</h2>
        <RefreshButton onRefresh={loadPhrases} isLoading={isLoading} />
      </div>
      {phrases.map((phrase) => (
        <PhraseCard key={phrase.phrase_id} phrase={phrase} />
      ))}
    </div>
  )
}