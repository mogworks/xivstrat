export interface LogContent {
  text: string
  isSignificant?: boolean
  isNew?: boolean
}

export interface Log {
  date: string
  content: LogContent[]
}

const globalUpdateLogs: Log[] = [
  {
    date: '2025-07-02',
    content: [
      {
        text: '新增更新日志功能',
        isNew: true,
      },
      {
        text: '新增仅看关键机制功能',
        isNew: true,
      },
      {
        text: '新增隐藏时间轴功能',
        isNew: true,
      },
    ],
  },
]

export const withGlobalLogs = (logs1: Log[]): Log[] => {
  const logMap = new Map<string, Log>()
  const processLog = (log: Log) => {
    const existing = logMap.get(log.date)

    if (existing) {
      const contentMap = new Map<string, LogContent>()
      existing.content.forEach(item => contentMap.set(item.text, item))
      log.content.forEach((item) => {
        if (!contentMap.has(item.text)) {
          contentMap.set(item.text, item)
        }
      })
      existing.content = Array.from(contentMap.values())
    } else {
      logMap.set(log.date, { ...log })
    }
  }
  logs1.forEach(processLog)
  globalUpdateLogs.forEach(processLog)
  return Array.from(logMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
