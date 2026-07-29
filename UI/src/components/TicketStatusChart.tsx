import { Typography } from 'antd'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatusDistribution } from '../types'

const { Text } = Typography

interface Props { data: StatusDistribution[] }

export default function TicketStatusChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.Count, 0)
  const chartData = data.map((d) => ({ name: d.Status, value: d.Count, color: d.Color }))

  return (
    <div style={{ flex: 1, background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong style={{ color: '#e5e7eb' }}>Ticket Status Distribution</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a2540', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Total</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {chartData.map((entry) => (
            <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: 13 }}>
                <span style={{ color: entry.color, marginRight: 6 }}>■</span>
                {entry.name}
              </span>
              <span style={{ color: '#e5e7eb', fontSize: 13 }}>
                {entry.value} ({total > 0 ? Math.round(entry.value / total * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
