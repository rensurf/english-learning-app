"use server"

import type { Phrase, Correction } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_SECRET = process.env.API_SECRET

async function apiRequest<T>(action: string, params: Record<string, any> = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set")
  }
  if (!API_SECRET) {
    throw new Error("API_SECRET environment variable is not set")
  }

  const requestBody = {
    action,
    ...params,
  }

  console.log('API Request:', requestBody)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.statusText}`
    try {
      const errorData = await response.json()
      console.error('API Error Response:', errorData)
      if (errorData.error) {
        errorMessage = `${errorData.error}`
      }
      if (errorData.error_type) {
        errorMessage += ` (${errorData.error_type})`
      }
    } catch (e) {
      console.error("Could not parse error response")
    }
    throw new Error(errorMessage)
  }

  const data = await response.json()
  console.log('API Response:', data)

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

interface CorrectionsResponse {
  success: boolean
  corrections: Correction[]
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

export async function getReviewPhrases(
  limit = 20,
  sortBy: 'priority' | 'reviewed_at' | 'query_count' | 'created_at' = 'priority',
  order: 'asc' | 'desc' = 'asc'
): Promise<PhrasesResponse> {
  return apiRequest<PhrasesResponse>("get_review_phrases", { limit, sort_by: sortBy, order })
}

export async function getAllPhrases(
  limit = 50,
  sortBy: 'created_at' | 'query_count' = 'created_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<PhrasesResponse> {
  return apiRequest<PhrasesResponse>("get_all_phrases", { limit, sort_by: sortBy, order })
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

export async function getCorrections(
  limit = 20,
  sortBy: 'created_at' = 'created_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<CorrectionsResponse> {
  return apiRequest<CorrectionsResponse>("get_corrections", { limit, sort_by: sortBy, order })
}

export async function getReviewCorrections(
  limit = 20,
  sortBy: 'created_at' = 'created_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<CorrectionsResponse> {
  return apiRequest<CorrectionsResponse>("get_review_corrections", { limit, sort_by: sortBy, order })
}