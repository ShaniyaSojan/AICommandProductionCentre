import {
  Typography, Descriptions, Tag, Spin, Alert, Breadcrumb, Timeline, Card, Space, Empty,
} from 'antd'
import { HistoryOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../api/client'

const { Title, Text } = Typography

const priorityColor: Record<string, string> = {
  Highest: 'red', High: 'orange', Medium: 'gold', Low: 'blue', Lowest: 'default',
}
const statusColor: Record<string, string> = {
  'To Do': 'default', 'In Progress': 'processing', Done: 'success',
  Resolved: 'success', Closed: 'default', Reopened: 'warning',
}

export default function TicketDetail() {
  const { issueKey } = useParams<{ issueKey: string }>()

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ['ticket', issueKey],
    queryFn: () => api.getTicket(issueKey!),
    enabled: !!issueKey,
  })

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['ticket-history', issueKey],
    queryFn: () => api.getTicketHistory(issueKey!),
    enabled: !!issueKey && !!ticket,
    staleTime: 60_000,
  })

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
  if (isError || !ticket) return <Alert type="error" message={`Ticket ${issueKey} not found in local DB. Run a sync first.`} showIcon />

  const t = ticket as unknown as Record<string, string | null | boolean | number>

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Projects</Link> },
          { title: <Link to={`/projects/${t.ProjectID}`}>Project</Link> },
          { title: String(issueKey) },
        ]}
      />

      <Space style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{issueKey}</Title>
        <Tag color={statusColor[String(t.Status)] ?? 'default'} style={{ fontSize: 14 }}>
          {String(t.Status)}
        </Tag>
        <Tag color={priorityColor[String(t.Priority)] ?? 'default'} style={{ fontSize: 14 }}>
          {String(t.Priority)}
        </Tag>
      </Space>

      <Title level={4} style={{ fontWeight: 400, marginBottom: 24 }}>{String(t.Summary)}</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Issue Key">{String(t.IssueKey)}</Descriptions.Item>
          <Descriptions.Item label="Type">{String(t.IssueType)}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColor[String(t.Status)] ?? 'default'}>{String(t.Status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={priorityColor[String(t.Priority)] ?? 'default'}>{String(t.Priority)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Assignee">{t.Assignee ? String(t.Assignee) : '—'}</Descriptions.Item>
          <Descriptions.Item label="Reporter">{t.Reporter ? String(t.Reporter) : '—'}</Descriptions.Item>
          <Descriptions.Item label="Created">
            {dayjs(String(t.CreatedDate)).format('DD MMM YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {dayjs(String(t.UpdatedDate)).format('DD MMM YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Resolution">
            {t.ResolutionDate ? dayjs(String(t.ResolutionDate)).format('DD MMM YYYY') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Synced">
            {dayjs(String(t.LastSynced)).format('DD MMM YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Epic Key" span={2}>{String(t.EpicKey)}</Descriptions.Item>
          {t.Description && (
            <Descriptions.Item label="Description" span={2}>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{String(t.Description)}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card
        title={
          <Space>
            <HistoryOutlined />
            {`Change History${history.length ? ` (${history.length})` : ''}`}
          </Space>
        }
        loading={historyLoading}
      >
        {history.length === 0 ? (
          <Empty description="No change history recorded yet" />
        ) : (
          <Timeline
            items={history.map((h) => ({
              children: (
                <div>
                  <Text strong>{h.FieldName}</Text>
                  <br />
                  <Text delete type="secondary">{h.OldValue ?? '(empty)'}</Text>
                  {' → '}
                  <Text type="success">{h.NewValue ?? '(empty)'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(h.ChangedOn).format('DD MMM YYYY HH:mm')}
                  </Text>
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  )
}
