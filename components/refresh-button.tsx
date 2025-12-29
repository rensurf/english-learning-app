"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onRefresh: () => void
  isLoading?: boolean
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRefresh}
      disabled={isLoading}
      className="gap-2"
    >
      <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  )
}