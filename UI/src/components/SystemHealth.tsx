import { Typography, Badge, Button, Divider, Spin, message } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useProject } from '../context/ProjectContext'

const { Text } = Typography

type BadgeStatus = 'success' | 'processing' | 'error' | 'warning' | 'default'

function statusBadge(value: string): BadgeStatus {
  if (value === 'Healthy' || value === 'Connected') return 'success'
  if (value === 'Running') return 'processing'
  if (value === 'Stopped') return 'warning'
  return 'error'
}

export default function SystemHealth() {
  const [syncing, setSyncing] = useState(false)
  const { selectedProject } = useProject()

  const { data: health, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 60_000,
  })

  const handleSync = async () => {
    if (!selectedProject) return
    setSyncing(true)
    try {
      const result = await api.syncProject(selectedProject)
      message.success(`Synced — ${result.Inserted} inserted, ${result.Updated} updated`)
    } catch {
      message.error('Sync failed. Check backend logs.')
    } finally {
      setSyncing(false)
    }
  }

  const items = health
    ? [
        { label: 'Jira Connection', value: health.JiraConnection },
        { label: 'Database', value: health.Database },
        { label: 'Scheduler', value: health.Scheduler },
      ]
    : []

  const overallStatus: BadgeStatus =
    !health ? 'default'
    : health.Database === 'Healthy' && health.JiraConnection === 'Connected' ? 'success'
    : 'warning'

  return (
    <div style={{ padding: '0 12px 16px' }}>
      <Divider style={{ borderColor: '#1e2d4a', margin: '8px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Badge status={overallStatus} />
        <Text style={{ color: '#9ca3af', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
          System Health
        </Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {isLoading ? (
          <Spin size="small" />
        ) : (
          items.map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#9ca3af', fontSize: 12 }}>{item.label}</Text>
              <Badge
                status={statusBadge(item.value)}
                text={<Text style={{ color: '#e5e7eb', fontSize: 12 }}>{item.value}</Text>}
              />
            </div>
          ))
        )}
      </div>
      <Button
        type="primary"
        icon={<SyncOutlined spin={syncing} />}
        loading={syncing}
        onClick={handleSync}
        disabled={!selectedProject}
        style={{ width: '100%', marginTop: 14, background: '#6c47ff', borderColor: '#6c47ff', fontWeight: 500 }}
      >
        Run Manual Sync
      </Button>
    </div>
  )
}
