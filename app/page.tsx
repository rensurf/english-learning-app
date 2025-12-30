"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardReview } from "@/components/flashcard-review"
import { AllPhrases } from "@/components/all-phrases"
import { CorrectionsReview } from "@/components/corrections-review"
import { AllCorrections } from "@/components/all-corrections"
import { BookOpen } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("review")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">English Review</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="all">All Phrases</TabsTrigger>
            <TabsTrigger value="corrections-review">Corrections</TabsTrigger>
            <TabsTrigger value="all-corrections">All Corrections</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="mt-0">
            <FlashcardReview />
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <AllPhrases />
          </TabsContent>

          <TabsContent value="corrections-review" className="mt-0">
            <CorrectionsReview />
          </TabsContent>

          <TabsContent value="all-corrections" className="mt-0">
            <AllCorrections />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
