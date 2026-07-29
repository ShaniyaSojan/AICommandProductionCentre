import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Table, Tag, Button, Spin, Alert } from 'antd'
import {
  ExclamationCircleOutlined, FileTextOutlined, CheckCircleOutlined,
  ClockCircleOutlined, RobotOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { api } from '../api/client'
import StatCard from '../components/StatCard'
import TicketStatusChart from '../components/TicketStatusChart'
import PriorityChart from '../components/PriorityChart'
import TicketDetailPanel from '../components/TicketDetailPanel'
import type { RecentTicket } from '../types'

const { Title, Text } = Typography

const PRIORITY_COLOR: Record<string, string> = {
  Highest: 'red', High: 'orange', Medium: 'gold', Low: 'blue', Lowest: 'default',
  P1: 'red', P2: 'orange', P3: 'gold', P4: 'blue', P5: 'default',
}

const COLUMNS = (onSelect: (t: RecentTicket) => void) => [
  {
    title: 'Key', dataIndex: 'IssueKey', key: 'IssueKey', width: 115,
    render: (key: string, record: RecentTicket) => (
      <Text style={{ color: '#6c9dff', fontWeight: 600, cursor: 'pointer' }} onClick={() => onSelect(record)}>
        {key}
      </Text>
    ),
  },
  {
    title: 'Summary', dataIndex: 'Summary', key: 'Summary', ellipsis: true,
    render: (s: string) => <Text style={{ color: '#e5e7eb' }}>{s}</Text>,
  },
  {
    title: 'Priority', dataIndex: 'Priority', key: 'Priority', width: 90,
    render: (p: string) => <Tag color={PRIORITY_COLOR[p] ?? 'default'} style={{ fontSize: 11 }}>{p}</Tag>,
  },
  {
    title: 'Status', dataIndex: 'Status', key: 'Status', width: 120,
    render: (_: string, record: RecentTicket) => <Tag color={record.Color} style={{ fontSize: 11 }}>{record.Status}</Tag>,
  },
  {
    title: 'Assignee', dataIndex: 'Assignee', key: 'Assignee', width: 130,
    render: (a: string | null) => <Text style={{ color: '#9ca3af', fontSize: 13 }}>{a ?? 'Unassigned'}</Text>,
  },
  {
    title: 'Updated', dataIndex: 'UpdatedDate', key: 'UpdatedDate', width: 110,
    render: (d: string) => <Text style={{ color: '#9ca3af', fontSize: 13 }}>{dayjs(d).format('HH:mm DD MMM')}</Text>,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.getDashboardSummary(),
    staleTime: 60_000,
  })

  const { data: statusData = [], isLoading: statusLoading } = useQuery({
    queryKey: ['dashboard-status'],
    queryFn: () => api.getDashboardStatus(),
    staleTime: 60_000,
  })

  const { data: priorityData = [], isLoading: priorityLoading } = useQuery({
    queryKey: ['dashboard-priority'],
    queryFn: () => api.getDashboardPriority(),
    staleTime: 60_000,
  })

  const { data: recentTickets = [], isLoading: recentLoading } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: () => api.getDashboardRecent(),
    staleTime: 60_000,
  })

  const chartsLoading = statusLoading || priorityLoading

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>Welcome back, Admin! 👋</Title>
          <Text style={{ color: '#9ca3af' }}>Here's what's happening with your production environment.</Text>
        </div>

        {summaryError && (
          <Alert type="error" message="Failed to load dashboard — check DB connection in .env" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatCard title="P0-Critical"    value={summaryLoading ? 0 : (summary?.P1Critical ?? 0)}    icon={<ExclamationCircleOutlined />} iconColor="#ef4444" trend={[]} trendColor="#ef4444" onViewAll={() => navigate('/tickets?filter=p1-critical')} />
          <StatCard title="Open Tickets"   value={summaryLoading ? 0 : (summary?.OpenTickets ?? 0)}   icon={<FileTextOutlined />}          iconColor="#60a5fa" trend={[]} trendColor="#60a5fa" onViewAll={() => navigate('/tickets?filter=open')} />
          <StatCard title="Resolved Today" value={summaryLoading ? 0 : (summary?.ResolvedToday ?? 0)} icon={<CheckCircleOutlined />}       iconColor="#34d399" trend={[]} trendColor="#34d399" onViewAll={() => navigate('/tickets?filter=resolved-today')} />
          <StatCard title="SLA At Risk"    value={summaryLoading ? 0 : (summary?.SLAAtRisk ?? 0)}     icon={<ClockCircleOutlined />}       iconColor="#fbbf24" trend={[]} trendColor="#fbbf24" onViewAll={() => navigate('/tickets?filter=sla-at-risk')} />
          <StatCard title="AI Alerts"      value={summary?.AIAlerts ?? 0}                             icon={<RobotOutlined />}             iconColor="#a78bfa" trend={[]} trendColor="#a78bfa" />
        </div>

        {/* Charts */}
        {chartsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (statusData.length > 0 || priorityData.length > 0) ? (
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <TicketStatusChart data={statusData} />
            <PriorityChart data={priorityData} />
          </div>
        ) : null}

        {/* Recent issues */}
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text strong style={{ color: '#e5e7eb', fontSize: 15 }}>Recent Production Issues</Text>
            <Button type="link" style={{ color: '#6c47ff', padding: 0 }}>View all tickets →</Button>
          </div>
          <Table<RecentTicket>
            dataSource={recentTickets}
            columns={COLUMNS((t) => setSelectedKey((prev) => prev === t.IssueKey ? null : t.IssueKey))}
            rowKey="IssueKey"
            loading={recentLoading}
            pagination={false}
            size="small"
            onRow={(record) => ({
              style: { cursor: 'pointer', background: selectedKey === record.IssueKey ? 'rgba(108, 71, 255, 0.08)' : undefined },
              onClick: () => setSelectedKey((prev) => prev === record.IssueKey ? null : record.IssueKey),
            })}
          />
        </div>
      </div>

      {/* Right detail panel */}
      {selectedKey && (
        <div style={{ width: 340, flexShrink: 0, position: 'sticky', top: 78 }}>
          <TicketDetailPanel issueKey={selectedKey} onClose={() => setSelectedKey(null)} />
        </div>
      )}
    </div>
  )
}
