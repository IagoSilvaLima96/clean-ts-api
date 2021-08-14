export interface LogErrorRepository {
  error: (stack: string) => Promise<void>
}
