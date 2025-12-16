"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getReviewPhrases, updateReviewed } from "@/lib/actions"
import type { Phrase } from "@/lib/types"

export function FlashcardReview() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewedCount, setReviewedCount] = useState(0)

  useEffect(() => {
    loadPhrases()
  }, [])

  const loadPhrases = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewPhrases(20)
      setPhrases(data.phrases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phrases")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (difficulty: string) => {
    const currentPhrase = phrases[currentIndex]

    // Update reviewed status
    try {
      await updateReviewed(currentPhrase.phrase_id)
    } catch (err) {
      console.error("Failed to update reviewed status:", err)
    }

    // Move to next card
    setReviewedCount(reviewedCount + 1)
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // All cards reviewed
      setCurrentIndex(phrases.length)
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
            <Button onClick={loadPhrases}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (phrases.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No phrases to review right now.</p>
        </CardContent>
      </Card>
    )
  }

  if (currentIndex >= phrases.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Review Complete! 🎉</h2>
            <p className="text-muted-foreground">You reviewed {reviewedCount} phrases today.</p>
          </div>
          <Button
            onClick={() => {
              setCurrentIndex(0)
              setReviewedCount(0)
              setIsFlipped(false)
              loadPhrases()
            }}
          >
            Review Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentPhrase = phrases[currentIndex]
  const progress = `${reviewedCount} / ${phrases.length} cards reviewed`

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-muted-foreground">{progress}</div>

      <div className="perspective-1000 mx-auto max-w-2xl">
        <Card
          className="min-h-[400px] cursor-pointer transition-all duration-500 hover:shadow-lg"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <CardContent className="flex min-h-[400px] items-center justify-center p-8">
            {!isFlipped ? (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">{currentPhrase.english}</h2>
                <p className="text-sm text-muted-foreground">Click to reveal translation</p>
              </div>
            ) : (
              <div className="text-center" style={{ transform: "rotateY(180deg)" }}>
                <h3 className="text-3xl font-bold text-foreground mb-4">{currentPhrase.japanese}</h3>
                {currentPhrase.context && <p className="text-muted-foreground italic">{currentPhrase.context}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isFlipped && (
        <div className="flex flex-wrap justify-center gap-3 animate-in fade-in">
          <Button variant="destructive" size="lg" onClick={() => handleRating("again")}>
            Again
          </Button>
          <Button variant="secondary" size="lg" onClick={() => handleRating("hard")}>
            Hard
          </Button>
          <Button variant="default" size="lg" onClick={() => handleRating("good")}>
            Good
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => handleRating("easy")}
            className="bg-accent text-accent-foreground"
          >
            Easy
          </Button>
        </div>
      )}
    </div>
  )
}
