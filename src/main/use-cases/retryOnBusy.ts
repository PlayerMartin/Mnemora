export async function retryOnBusy<T>(fn: () => Promise<T>, retries = 5, delayMs = 200): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const isBusy = error && typeof error === 'object' && 'code' in error && error.code === 'EBUSY'
      if (!isBusy || attempt >= retries) throw error
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}
