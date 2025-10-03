import { withGlobalLogs } from '@/lib/global-update-logs'

export const updateLogs = withGlobalLogs([
  {
    date: '2025-07-01',
    content: [
      {
        text: '17:00 已重新校准 M5S～M8S 的国服场地标点，修复前两层标点错位的问题',
        isSignificant: true,
      },
    ],
  },
])
