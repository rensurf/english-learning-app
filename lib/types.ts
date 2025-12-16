export interface Phrase {
  phrase_id: string
  english: string
  japanese: string
  context?: string
  query_count: number
  reviewed_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  [key: string]: any
}
