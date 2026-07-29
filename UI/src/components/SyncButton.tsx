import { useState } from 'react'
import { Button, Modal, Statistic, Row, Col, Table, Tag, message } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { api } from '../api/client'
import type { SyncResult, SyncDetail } from '../types'

interface Props {
  projectName: string
}

const actionColor: Record<string, string> = {
  Inserted: 'green',
  Updated: 'blue',
  'No Changes': 'default',
}

export default function SyncButton({ projectName }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  const handleSync = async () => {
    setLoading(true)
    try {
      const data = await api.syncProject(projectName)
      setResult(data)
      message.success(`Sync complete — ${data.Inserted} inserted, ${data.Updated} updated`)
    } catch {
      message.error('Sync failed. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'Issue Key', dataIndex: 'IssueKey', key: 'IssueKey' },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (action: string) => (
        <Tag color={actionColor[action] ?? 'default'}>{action}</Tag>
      ),
    },
  ]

  return (
    <>
      <Button
        type="primary"
        icon={<SyncOutlined spin={loading} />}
        loading={loading}
        onClick={handleSync}
      >
        Sync Now
      </Button>

      <Modal
        title={`Sync Results — ${projectName}`}
        open={!!result}
        onOk={() => setResult(null)}
        onCancel={() => setResult(null)}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={() => setResult(null)}>
            Close
          </Button>,
        ]}
      >
        {result && (
          <>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic title="Inserted" value={result.Inserted} valueStyle={{ color: '#52c41a' }} />
              </Col>
              <Col span={8}>
                <Statistic title="Updated" value={result.Updated} valueStyle={{ color: '#1677ff' }} />
              </Col>
              <Col span={8}>
                <Statistic title="Unchanged" value={result.Unchanged} />
              </Col>
            </Row>
            <Table<SyncDetail>
              dataSource={result.Results}
              columns={columns}
              rowKey="IssueKey"
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </>
        )}
      </Modal>
    </>
  )
}
