type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  context: string
  message: string
  data?: unknown
  error?: unknown
}

class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private formatLog(level: LogLevel, message: string, data?: unknown, error?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    }
  }

  private log(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]`
    const logMessage = `${prefix} ${entry.message}`

    switch (entry.level) {
      case "error":
        console.error(logMessage, entry.error || "", entry.data || "")
        break
      case "warn":
        console.warn(logMessage, entry.data || "")
        break
      case "debug":
        if (process.env.NODE_ENV === "development") {
          console.debug(logMessage, entry.data || "")
        }
        break
      default:
        console.log(logMessage, entry.data || "")
    }
  }

  info(message: string, data?: unknown) {
    this.log(this.formatLog("info", message, data))
  }

  warn(message: string, data?: unknown) {
    this.log(this.formatLog("warn", message, data))
  }

  error(message: string, error?: unknown, data?: unknown) {
    this.log(this.formatLog("error", message, data, error))
  }

  debug(message: string, data?: unknown) {
    this.log(this.formatLog("debug", message, data))
  }

  // Use case specific methods
  useCaseStart(useCaseName: string, input?: unknown) {
    this.info(`UseCase [${useCaseName}] started`, input)
  }

  useCaseSuccess(useCaseName: string, result?: unknown) {
    this.info(`UseCase [${useCaseName}] completed successfully`, result)
  }

  useCaseError(useCaseName: string, error: unknown, input?: unknown) {
    this.error(`UseCase [${useCaseName}] failed`, error, input)
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context)
}

export const logger = createLogger("App")
