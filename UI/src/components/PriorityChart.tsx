import { Typography } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { PriorityDistribution } from '../types'

const { Text } = Typography

const PRIORITY_LABEL: Record<string, string> = {
  Highest: 'P1', High: 'P2', Medium: 'P3', Low: 'P4', Lowest: 'P5',
}
const PRIORITY_COLOR: Record<string, string> = {
  P1: '#ef4444', P2: '#f97316', P3: '#eab308', P4: '#3b82f6', P5: '#6b7280',
}

interface Props { data: PriorityDistribution[] }

export default function PriorityChart({ data }: Props) {
  const counts: Record<string, number> = {}
  for (const d of data) {
    const label = PRIORITY_LABEL[d.Priority] ?? d.Priority
    counts[label] = (counts[label] ?? 0) + d.Count
  }
  const chartData = ['P1', 'P2', 'P3', 'P4', 'P5'].map((p) => ({ name: p, value: counts[p] ?? 0 }))

  return (
    <div style={{ flex: 1, background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ color: '#e5e7eb' }}>Priority Distribution</Text>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1a2540', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#e5e7eb' }}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={PRIORITY_COLOR[entry.name] ?? '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
