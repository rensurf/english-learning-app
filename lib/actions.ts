"use server"

import type { Phrase } from "./types"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mxw2ttoognhtpjwvfvq4itjw7a0qdfqc.lambda-url.ap-northeast-1.on.aws/"
const API_SECRET = process.env.API_SECRET || "change-me-in-production"

async function apiRequest<T>(action: string, params: Record<string, any> = {}): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    },
    body: JSON.stringify({
      action,
      ...params,
    }),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error || "API request failed")
  }

  return data
}

// 型定義
interface PhrasesResponse {
  success: boolean
  phrases: Phrase[]
}

interface UpdateReviewedResponse {
  success: boolean
  phrase_id: string
}

interface WeaknessesResponse {
  success: boolean
  weaknesses: Array<{
    pattern: string
    count: number
    examples: Array<{
      original: string
      corrected: string
      feedback: string
    }>
  }>
}

interface StatsResponse {
  success: boolean
  stats: {
    total_phrases: number
    total_corrections: number
    reviewed_phrases: number
    never_reviewed: number
  }
}

export async function getReviewPhrases(limit = 20): Promise<PhrasesResponse> {
  return apiRequest<PhrasesResponse>("get_review_phrases", { limit })
}

export async function getAllPhrases(limit = 50): Promise<PhrasesResponse> {
  return apiRequest<PhrasesResponse>("get_all_phrases", { limit })
}

export async function updateReviewed(phraseId: string): Promise<UpdateReviewedResponse> {
  return apiRequest<UpdateReviewedResponse>("update_reviewed", { phrase_id: phraseId })
}

export async function getWeaknesses(limit = 10): Promise<WeaknessesResponse> {
  return apiRequest<WeaknessesResponse>("get_weaknesses", { limit })
}

export async function getStats(): Promise<StatsResponse> {
  return apiRequest<StatsResponse>("get_stats")
}