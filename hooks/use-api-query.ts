import { useState, useEffect } from 'react'

interface UseApiQueryResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  mutate: () => void
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await queryFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, error, isLoading, mutate: fetchData }
} 