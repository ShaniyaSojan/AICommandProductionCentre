import axios from 'axios'
import type {
  Project, Ticket, JiraTicket, SyncResult,
  DashboardSummary, StatusDistribution, PriorityDistribution, RecentTicket,
  Comment, TicketHistory, HealthStatus,
} from '../types'

const http = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export const api = {
  getProjects: () =>
    http.get<Project[]>('/projects').then((r) => r.data),

  getJiraTickets: (projectName: string) =>
    http.get<JiraTicket[]>(`/projects/${projectName}/tickets`).then((r) => r.data),

  getTicket: (issueKey: string) =>
    http.get<Ticket>(`/tickets/${issueKey}`).then((r) => r.data),

  getTicketComments: (issueKey: string) =>
    http.get<Comment[]>(`/tickets/${issueKey}/comments`).then((r) => r.data),

  getTicketHistory: (issueKey: string) =>
    http.get<TicketHistory[]>(`/tickets/${issueKey}/history`).then((r) => r.data),

  syncProject: (projectName: string) =>
    http.post<SyncResult>(`/projects/${projectName}/sync`).then((r) => r.data),

  getDashboardSummary: () =>
    http.get<DashboardSummary>('/dashboard').then((r) => r.data),

  getDashboardStatus: () =>
    http.get<StatusDistribution[]>('/dashboard/status').then((r) => r.data),

  getDashboardPriority: () =>
    http.get<PriorityDistribution[]>('/dashboard/priority').then((r) => r.data),

  getDashboardRecent: () =>
    http.get<RecentTicket[]>('/dashboard/recent').then((r) => r.data),

  getFilteredTickets: (filter: string) =>
    http.get<RecentTicket[]>('/tickets', { params: { filter } }).then((r) => r.data),

  getHealth: () =>
    http.get<HealthStatus>('/health').then((r) => r.data),
}
