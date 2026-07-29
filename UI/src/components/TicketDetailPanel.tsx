import { Tabs, Tag, Typography, Descriptions, Progress, Empty, Space, Spin, Timeline, Avatar } from 'antd'
import { StarOutlined, CloseOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { api } from '../api/client'

const { Text, Title } = Typography

const PRIORITY_COLOR: Record<string, string> = {
  Highest: 'red', High: 'orange', Medium: 'gold', Low: 'blue', Lowest: 'default',
  P1: 'red', P2: 'orange', P3: 'gold', P4: 'blue', P5: 'default',
}
const STATUS_COLOR: Record<string, string> = {
  'Open': 'default', 'In Progress': 'processing', 'Done': 'success',
  'Resolved': 'success', 'Closed': 'default', 'Reopened': 'warning', 'To Do': 'default',
}

const SLA_HOURS = 24

interface Props {
  issueKey: string
  onClose: () => void
}

export default function TicketDetailPanel({ issueKey, onClose }: Props) {
  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ['ticket', issueKey],
    queryFn: () => api.getTicket(issueKey),
    staleTime: 60_000,
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['ticket-comments', issueKey],
    queryFn: () => api.getTicketComments(issueKey),
    staleTime: 60_000,
  })

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['ticket-history', issueKey],
    queryFn: () => api.getTicketHistory(issueKey),
    staleTime: 60_000,
  })

  const elapsedHours = ticket ? dayjs().diff(dayjs(ticket.CreatedDate), 'hour') : 0
  const slaPercent = Math.min(100, Math.round((elapsedHours / SLA_HOURS) * 100))
  const slaAtRisk = elapsedHours >= SLA_HOURS

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      children: ticketLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
      ) : ticket ? (
        <div style={{ paddingBottom: 16 }}>
          <Descriptions column={1} size="small"
            labelStyle={{ color: '#9ca3af', width: 90, fontSize: 12 }}
            contentStyle={{ color: '#e5e7eb', fontSize: 13 }}
          >
            <Descriptions.Item label="Project">{ticket.IssueKey.split('-')[0]}</Descriptions.Item>
            <Descriptions.Item label="Assignee">{ticket.Assignee ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Reporter">{ticket.Reporter ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Created">{dayjs(ticket.CreatedDate).format('DD MMM YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Updated">{dayjs(ticket.UpdatedDate).format('DD MMM YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Resolution">
              {ticket.ResolutionDate ? dayjs(ticket.ResolutionDate).format('DD MMM YYYY') : '—'}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 12 }}>
            <Text style={{ color: slaAtRisk ? '#fbbf24' : '#9ca3af', fontSize: 12 }}>SLA</Text>
            <Progress
              percent={slaPercent}
              showInfo={false}
              strokeColor={slaAtRisk ? '#ef4444' : '#6c47ff'}
              trailColor="#1e2d4a"
              size="small"
              style={{ marginTop: 4 }}
            />
            <Text style={{ color: slaAtRisk ? '#fbbf24' : '#9ca3af', fontSize: 11 }}>
              {SLA_HOURS}h SLA — {elapsedHours}h elapsed{slaAtRisk ? ' ⚠ At risk' : ''}
            </Text>
          </div>
          {ticket.Description && (
            <div style={{ marginTop: 12 }}>
              <Text style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 4 }}>Description</Text>
              <Text style={{ color: '#d1d5db', fontSize: 13, whiteSpace: 'pre-wrap' }}>{ticket.Description}</Text>
            </div>
          )}
        </div>
      ) : null,
    },
    {
      key: 'comments',
      label: `Comments${comments.length ? ` (${comments.length})` : ''}`,
      children: commentsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
      ) : comments.length === 0 ? (
        <Empty description={<Text style={{ color: '#9ca3af' }}>No comments — sync to load</Text>} style={{ padding: '24px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
          {comments.map((c) => (
            <div key={c.JiraCommentID} style={{ background: '#0f1729', border: '1px solid #1e2d4a', borderRadius: 8, padding: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Avatar size={22} icon={<UserOutlined />} style={{ background: '#6c47ff', flexShrink: 0 }} />
                <Text style={{ color: '#e5e7eb', fontSize: 12, fontWeight: 600 }}>{c.AuthorName}</Text>
                <Text style={{ color: '#6b7280', fontSize: 11, marginLeft: 'auto' }}>
                  {dayjs(c.CreatedDate).format('DD MMM HH:mm')}
                </Text>
              </div>
              <Text style={{ color: '#d1d5db', fontSize: 12, whiteSpace: 'pre-wrap' }}>{c.CommentText}</Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'history',
      label: `History${history.length ? ` (${history.length})` : ''}`,
      children: historyLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
      ) : history.length === 0 ? (
        <Empty description={<Text style={{ color: '#9ca3af' }}>No changes recorded yet</Text>} style={{ padding: '24px 0' }} />
      ) : (
        <Timeline
          style={{ paddingTop: 12 }}
          items={history.map((h) => ({
            children: (
              <div>
                <Text strong style={{ color: '#e5e7eb', fontSize: 13 }}>{h.FieldName}</Text>
                <br />
                <Text delete type="secondary" style={{ fontSize: 12 }}>{h.OldValue ?? '(empty)'}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}> → </Text>
                <Text type="success" style={{ fontSize: 12 }}>{h.NewValue ?? '(empty)'}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {dayjs(h.ChangedOn).format('DD MMM YYYY HH:mm')}
                </Text>
              </div>
            ),
          }))}
        />
      ),
    },
    {
      key: 'ai',
      label: 'AI Analysis',
      children: (
        <div style={{ paddingBottom: 16 }}>
          <div style={{
            background: 'rgba(108, 71, 255, 0.1)',
            border: '1px solid rgba(108, 71, 255, 0.3)',
            borderRadius: 8, padding: 12, marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <RobotOutlined style={{ color: '#a78bfa' }} />
              <Text style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>AI Analysis</Text>
              <Tag color="purple" style={{ fontSize: 10, lineHeight: '16px' }}>Beta</Tag>
            </div>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
              AI analysis will be available once the AI service is integrated. Enable AI features to get intelligent root cause analysis, recommended actions, and similar incident matching.
            </Text>
          </div>
          <Empty description={<Text style={{ color: '#9ca3af' }}>AI service coming soon</Text>} />
        </div>
      ),
    },
  ]

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e2d4a',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Space size={6}>
            <Text strong style={{ color: '#fff', fontSize: 14 }}>{issueKey}</Text>
            {ticket && (
              <>
                <Tag color={PRIORITY_COLOR[ticket.Priority] ?? 'default'} style={{ fontSize: 11, margin: 0 }}>{ticket.Priority}</Tag>
                <Tag color={STATUS_COLOR[ticket.Status] ?? 'default'} style={{ fontSize: 11, margin: 0 }}>{ticket.Status}</Tag>
              </>
            )}
          </Space>
          <Space size={10}>
            <StarOutlined style={{ color: '#9ca3af', cursor: 'pointer' }} />
            <CloseOutlined style={{ color: '#9ca3af', cursor: 'pointer', fontSize: 13 }} onClick={onClose} />
          </Space>
        </div>
        {ticketLoading ? (
          <Spin size="small" />
        ) : (
          <Title level={5} style={{ color: '#e5e7eb', margin: 0, fontWeight: 500, fontSize: 13, lineHeight: 1.4 }}>
            {ticket?.Summary}
          </Title>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        <Tabs items={tabs} size="small" />
      </div>
    </div>
  )
}
