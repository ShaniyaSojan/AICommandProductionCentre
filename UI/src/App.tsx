import { useState, useEffect } from 'react'
import { Layout, Menu, Select, Space, Typography, Avatar, Badge, Tooltip } from 'antd'
import {
  DashboardOutlined, AppstoreOutlined, BugOutlined, ClockCircleOutlined,
  BulbOutlined, BarChartOutlined, RobotOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, ThunderboltFilled,
  SearchOutlined, BellOutlined, UserOutlined,
} from '@ant-design/icons'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from './api/client'
import { ProjectProvider, useProject } from './context/ProjectContext'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import TicketDetail from './pages/TicketDetail'
import TicketList from './pages/TicketList'
import ComingSoon from './pages/ComingSoon'
import SystemHealth from './components/SystemHealth'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const NAV = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/projects', icon: <AppstoreOutlined />, label: 'Projects' },
  { key: '/tickets', icon: <BugOutlined />, label: 'Tickets' },
  { key: '/sla', icon: <ClockCircleOutlined />, label: 'SLA Monitoring' },
  { key: '/insights', icon: <BulbOutlined />, label: 'AI Insights' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
  { key: '/assistant', icon: <RobotOutlined />, label: 'AI Assistant' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
]

function AppInner() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedProject, setSelectedProject } = useProject()
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: api.getProjects })

  useEffect(() => {
    if (projects?.length && !selectedProject) {
      setSelectedProject(projects[0].ProjectName)
    }
  }, [projects, selectedProject, setSelectedProject])

  const selectedKey = NAV.find((n) => location.pathname === n.key || location.pathname.startsWith(n.key + '/'))?.key ?? '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        collapsedWidth={64}
        collapsed={collapsed}
        style={{ background: '#07091a', borderRight: '1px solid #1e2d4a', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div style={{
            padding: collapsed ? '18px 0' : '18px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid #1e2d4a', flexShrink: 0,
          }}>
            <ThunderboltFilled style={{ fontSize: 22, color: '#6c47ff', flexShrink: 0 }} />
            {!collapsed && (
              <Text strong style={{ color: '#fff', fontSize: 12, lineHeight: 1.4 }}>
                AI Production<br />Command Center
              </Text>
            )}
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflow: 'auto', paddingTop: 6 }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              inlineCollapsed={collapsed}
              style={{ background: 'transparent', border: 'none' }}
              items={NAV}
              onClick={({ key }) => {
                if (key === '/projects' || key === '/tickets') {
                  if (selectedProject) navigate(`/projects/${selectedProject}`)
                } else {
                  navigate(key)
                }
              }}
            />
          </div>

          {/* System health — hide when collapsed */}
          {!collapsed && <SystemHealth />}
        </div>
      </Sider>

      <Layout>
        <Header style={{
          background: '#0b1120', borderBottom: '1px solid #1e2d4a',
          padding: '0 20px', height: 54, lineHeight: '54px',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
        }}>
          {collapsed
            ? <MenuUnfoldOutlined style={{ color: '#9ca3af', cursor: 'pointer' }} onClick={() => setCollapsed(false)} />
            : <MenuFoldOutlined style={{ color: '#9ca3af', cursor: 'pointer' }} onClick={() => setCollapsed(true)} />
          }

          <Space size={6} align="center">
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Project:</Text>
            <Select
              value={selectedProject || undefined}
              onChange={setSelectedProject}
              placeholder="Select"
              style={{ width: 130 }}
              variant="borderless"
              options={projects?.map((p) => ({ value: p.ProjectName, label: p.ProjectName }))}
            />
          </Space>

          <Space size={4} align="center">
            <Badge status="success" />
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Jira Connection: Connected</Text>
          </Space>

          <div style={{ flex: 1 }} />

          <Space size={18}>
            <Tooltip title="Search">
              <SearchOutlined style={{ color: '#9ca3af', fontSize: 16, cursor: 'pointer' }} />
            </Tooltip>
            <Tooltip title="Notifications">
              <BellOutlined style={{ color: '#9ca3af', fontSize: 16, cursor: 'pointer' }} />
            </Tooltip>
            <Space size={8} align="center">
              <Avatar size={28} icon={<UserOutlined />} style={{ background: '#6c47ff' }} />
              <Text style={{ color: '#e5e7eb', fontSize: 13 }}>Admin</Text>
            </Space>
          </Space>
        </Header>

        <Content style={{ background: '#090e1a', padding: 24, minHeight: 'calc(100vh - 54px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/:projectName" element={<ProjectDetail />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/:issueKey" element={<TicketDetail />} />
            <Route path="/sla" element={<ComingSoon title="SLA Monitoring" />} />
            <Route path="/insights" element={<ComingSoon title="AI Insights" />} />
            <Route path="/reports" element={<ComingSoon title="Reports" />} />
            <Route path="/assistant" element={<ComingSoon title="AI Assistant" />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default function App() {
  return (
    <ProjectProvider>
      <AppInner />
    </ProjectProvider>
  )
}
