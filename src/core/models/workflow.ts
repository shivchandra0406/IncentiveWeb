export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  type: WorkflowStepType;
  config: Record<string, any>;
  nextStepId?: string;
}

export enum WorkflowStepType {
  APPROVAL = 'APPROVAL',
  NOTIFICATION = 'NOTIFICATION',
  CALCULATION = 'CALCULATION',
  CONDITION = 'CONDITION',
  ACTION = 'ACTION'
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  status: WorkflowInstanceStatus;
  currentStepId: string;
  data: Record<string, any>;
  history: WorkflowStepExecution[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStepExecution {
  stepId: string;
  status: WorkflowStepExecutionStatus;
  result?: Record<string, any>;
  executedAt: string;
  executedBy?: string;
}

export enum WorkflowInstanceStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  WAITING = 'WAITING'
}

export enum WorkflowStepExecutionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export interface WorkflowFilters {
  status?: WorkflowStatus;
  search?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  description: string;
  steps: Omit<WorkflowStep, 'id'>[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  steps?: WorkflowStep[];
}

export interface WorkflowListResponse {
  workflows: Workflow[];
  total: number;
  page: number;
  limit: number;
}
