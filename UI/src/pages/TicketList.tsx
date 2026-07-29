import { useState } from 'react'
import { Typography, Table, Tag, Alert, Breadcrumb } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../api/client'
import type { RecentTicket } from '../types'

const { Title, Text } = Typography

const PRIORITY_COLOR: Record<string, string> = {
  Highest: 'red', High: 'orange', Medium: 'gold', Low: 'blue', Lowest: 'default',
  P1: 'red', P2: 'orange', P3: 'gold', P4: 'blue', P5: 'default',
}

const FILTER_TITLES: Record<string, string> = {
  'open':          'Open Tickets',
  'p1-critical':   'P1 Critical Tickets',
  'resolved-today':'Resolved Today',
  'sla-at-risk':   'SLA At Risk Tickets',
}

export default function TicketList() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const filter = searchParams.get('filter') ?? 'open'
  const title = FILTER_TITLES[filter] ?? 'Tickets'

  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['filtered-tickets', filter],
    queryFn: () => api.getFilteredTickets(filter),
    staleTime: 60_000,
  })

  const columns = [
    {
      title: 'Key', dataIndex: 'IssueKey', key: 'IssueKey', width: 120,
      render: (key: string) => (
        <Text
          style={{ color: '#6c9dff', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigate(`/tickets/${key}`)}
        >
          {key}
        </Text>
      ),
    },
    {
      title: 'Summary', dataIndex: 'Summary', key: 'Summary', ellipsis: true,
      render: (s: string) => <Text style={{ color: '#e5e7eb' }}>{s}</Text>,
    },
    {
      title: 'Status', dataIndex: 'Status', key: 'Status', width: 150,
      render: (_: string, record: RecentTicket) => (
        <Tag color={record.Color} style={{ fontSize: 11 }}>{record.Status}</Tag>
      ),
    },
    {
      title: 'Priority', dataIndex: 'Priority', key: 'Priority', width: 100,
      render: (p: string) => <Tag color={PRIORITY_COLOR[p] ?? 'default'} style={{ fontSize: 11 }}>{p}</Tag>,
    },
    {
      title: 'Customer', dataIndex: 'Customer', key: 'Customer', width: 140,
      render: (c: string | null) => <Text style={{ color: '#9ca3af', fontSize: 13 }}>{c ?? '—'}</Text>,
    },
    {
      title: 'Assignee', dataIndex: 'Assignee', key: 'Assignee', width: 130,
      render: (a: string | null) => <Text style={{ color: '#9ca3af', fontSize: 13 }}>{a ?? 'Unassigned'}</Text>,
    },
    {
      title: 'Updated', dataIndex: 'UpdatedDate', key: 'UpdatedDate', width: 120,
      render: (d: string) => <Text style={{ color: '#9ca3af', fontSize: 13 }}>{dayjs(d).format('HH:mm DD MMM')}</Text>,
    },
  ]

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title },
        ]}
      />

      <Title level={3} style={{ color: '#fff', marginBottom: 20 }}>{title}</Title>

      {isError && (
        <Alert type="error" message="Failed to load tickets — check DB connection" showIcon style={{ marginBottom: 16 }} />
      )}

      <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, padding: 16 }}>
        <Table<RecentTicket>
          dataSource={tickets}
          columns={columns}
          rowKey="IssueKey"
          loading={isLoading}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          size="small"
          onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: () => navigate(`/tickets/${record.IssueKey}`),
          })}
        />
      </div>
    </div>
  )
}
