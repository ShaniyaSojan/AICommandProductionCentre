import { useState } from 'react'
import {
  Typography, Table, Tag, Alert, Space, Segmented, Button, Breadcrumb,
} from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../api/client'
import SyncButton from '../components/SyncButton'
import type { JiraTicket } from '../types'

const { Title } = Typography

const priorityColor: Record<string, string> = {
  Highest: 'red', High: 'orange', Medium: 'gold', Low: 'blue', Lowest: 'default',
}
const statusColor: Record<string, string> = {
  'To Do': 'default', 'In Progress': 'processing', Done: 'success', Resolved: 'success',
  Closed: 'default', Reopened: 'warning',
}

export default function ProjectDetail() {
  const { projectName } = useParams<{ projectName: string }>()
  const navigate = useNavigate()
  const [source] = useState<'jira'>('jira')

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['jira-tickets', projectName, source],
    queryFn: () => api.getJiraTickets(projectName!),
    enabled: !!projectName,
  })

  const columns = [
    {
      title: 'Key',
      dataIndex: 'IssueKey',
      key: 'IssueKey',
      width: 130,
      render: (key: string) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => navigate(`/tickets/${key}`)}>
          {key}
        </Button>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'Summary',
      key: 'Summary',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'IssueType',
      key: 'IssueType',
      width: 110,
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 130,
      render: (s: string) => <Tag color={statusColor[s] ?? 'default'}>{s}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'Priority',
      key: 'Priority',
      width: 100,
      render: (p: string) => <Tag color={priorityColor[p] ?? 'default'}>{p}</Tag>,
    },
    {
      title: 'Assignee',
      dataIndex: 'Assignee',
      key: 'Assignee',
      width: 150,
      render: (a: string | null) => a ?? <span style={{ color: '#bfbfbf' }}>Unassigned</span>,
    },
    {
      title: 'Updated',
      dataIndex: 'UpdatedDate',
      key: 'UpdatedDate',
      width: 140,
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
    },
  ]

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Projects</Link> },
          { title: projectName },
        ]}
      />
      <Space style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>{projectName}</Title>
        <Space>
          <Segmented options={['Jira (Live)']} value="Jira (Live)" />
          <SyncButton projectName={projectName!} />
          <Button onClick={() => refetch()}>Refresh</Button>
        </Space>
      </Space>

      {isError && (
        <Alert type="error" message="Failed to load tickets. Check Jira credentials in .env." showIcon style={{ marginBottom: 16 }} />
      )}

      <Table<JiraTicket>
        dataSource={tickets}
        columns={columns}
        rowKey="IssueKey"
        loading={isLoading}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 900 }}
        onRow={(record) => ({
          style: { cursor: 'pointer' },
          onClick: () => navigate(`/tickets/${record.IssueKey}`),
        })}
      />
    </div>
  )
}
