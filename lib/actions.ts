"use server"

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

export async function getReviewPhrases(limit = 20) {
  return apiRequest("get_review_phrases", { limit })
}

export async function getAllPhrases(limit = 50) {
  return apiRequest("get_all_phrases", { limit })
}

export async function updateReviewed(phraseId: string) {
  return apiRequest("update_reviewed", { phrase_id: phraseId })
}

export async function getWeaknesses(limit = 10) {
  return apiRequest("get_weaknesses", { limit })
}

export async function getStats() {
  return apiRequest("get_stats")
}
