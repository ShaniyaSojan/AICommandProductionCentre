import { Result, Button, Typography } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

interface Props { title: string }

export default function ComingSoon({ title }: Props) {
  const navigate = useNavigate()
  return (
    <Result
      icon={<ClockCircleOutlined style={{ color: '#6c47ff' }} />}
      title={<Text style={{ color: '#e5e7eb', fontSize: 22 }}>{title}</Text>}
      subTitle={<Text style={{ color: '#9ca3af' }}>This feature is coming soon — stay tuned!</Text>}
      extra={
        <Button type="primary" onClick={() => navigate('/')} style={{ background: '#6c47ff', borderColor: '#6c47ff' }}>
          Back to Dashboard
        </Button>
      }
      style={{ marginTop: 60 }}
    />
  )
}
