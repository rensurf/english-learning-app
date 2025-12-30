export interface Phrase {
  phrase_id: string
  english: string
  japanese: string
  context?: string
  query_count: number
  reviewed_at?: string
}

export interface Correction {
  correction_id: string
  user_id: string
  original_text: string
  corrected_text: string
  feedback: string
  error_pattern?: string
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  [key: string]: any
}
