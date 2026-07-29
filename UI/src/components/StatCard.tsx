import { Typography } from 'antd'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import type { ReactNode } from 'react'

const { Text } = Typography

interface Props {
  title: string
  value: number
  icon: ReactNode
  iconColor: string
  trend: number[]
  trendColor: string
  onViewAll?: () => void
}

export default function StatCard({ title, value, icon, iconColor, trend, trendColor, onViewAll }: Props) {
  const data = trend.map((v) => ({ v }))
  return (
    <div style={{
      flex: 1, minWidth: 160,
      background: '#111827',
      border: '1px solid #1e2d4a',
      borderRadius: 10,
      padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>{title}</Text>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 2, lineHeight: 1.2 }}>{value}</div>
          {onViewAll && (
            <Text style={{ color: '#6c47ff', fontSize: 12, cursor: 'pointer' }} onClick={onViewAll}>View all →</Text>
          )}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${iconColor}20`,
          border: `1px solid ${iconColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor, fontSize: 18,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ marginTop: 14, height: 38 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Area type="monotone" dataKey="v" stroke={trendColor} fill={`${trendColor}20`} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
