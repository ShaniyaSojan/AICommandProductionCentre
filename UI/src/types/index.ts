export interface Project {
  ProjectID: number
  ProjectName: string
  IsEnabled: boolean
}

export interface DashboardSummary {
  TotalTickets: number
  OpenTickets: number
  ResolvedToday: number
  P1Critical: number
  SLAAtRisk: number
  AIAlerts: number
}

export interface StatusDistribution {
  Status: string
  Count: number
  Color: string
}

export interface PriorityDistribution {
  Priority: string
  Count: number
}

export interface RecentTicket {
  IssueKey: string
  Summary: string
  Status: string
  Priority: string
  Customer: string | null
  Assignee: string | null
  UpdatedDate: string
  Color: string
}

export interface HealthStatus {
  Database: string
  JiraConnection: string
  Scheduler: string
}

export interface Ticket {
  TicketID: number
  JiraIssueID: string
  IssueKey: string
  ProjectID: number
  EpicKey: string
  Summary: string
  Description: string | null
  IssueType: string
  Status: string
  Priority: string
  Assignee: string | null
  Reporter: string | null
  CreatedDate: string
  UpdatedDate: string
  ResolutionDate: string | null
  LastSynced: string
  IsActive: boolean
  Customer: string | null
  Severity: string | null
}

export interface Comment {
  JiraCommentID: string
  TicketID: number
  IssueKey: string
  AuthorName: string
  CommentText: string
  CreatedDate: string
  UpdatedDate: string
}

export interface TicketHistory {
  TicketID: number
  IssueKey: string
  FieldName: string
  OldValue: string | null
  NewValue: string | null
  ChangedOn: string
}

export interface SyncResult {
  Project: string
  Processed: number
  Inserted: number
  Updated: number
  Unchanged: number
  Results: SyncDetail[]
}

export interface SyncDetail {
  IssueKey: string
  Action: 'Inserted' | 'Updated' | 'No Changes'
  Changes: Array<{ Field: string; OldValue: string | null; NewValue: string | null }>
  Comments: { Inserted: number; Updated: number; Unchanged: number }
}

export interface JiraTicket {
  JiraIssueID: string
  IssueKey: string
  Summary: string
  Description: string | null
  IssueType: string
  Status: string
  Priority: string
  Assignee: string | null
  Reporter: string | null
  CreatedDate: string
  UpdatedDate: string
  ResolutionDate: string | null
  EpicKey: string | null
  Customer: string | null
  Severity: string | null
}
