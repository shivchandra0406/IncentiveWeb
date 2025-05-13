import { 
  CreateWorkflowRequest, 
  UpdateWorkflowRequest, 
  Workflow, 
  WorkflowFilters, 
  WorkflowInstance, 
  WorkflowListResponse 
} from '../models/workflow';

export interface WorkflowService {
  getWorkflows(filters?: WorkflowFilters, page?: number, limit?: number): Promise<WorkflowListResponse>;
  getWorkflowById(id: string): Promise<Workflow>;
  createWorkflow(workflowData: CreateWorkflowRequest): Promise<Workflow>;
  updateWorkflow(id: string, workflowData: UpdateWorkflowRequest): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<void>;
  activateWorkflow(id: string): Promise<Workflow>;
  deactivateWorkflow(id: string): Promise<Workflow>;
  
  // Workflow instances
  startWorkflow(workflowId: string, initialData: Record<string, any>): Promise<WorkflowInstance>;
  getWorkflowInstance(instanceId: string): Promise<WorkflowInstance>;
  advanceWorkflowInstance(instanceId: string, stepData: Record<string, any>): Promise<WorkflowInstance>;
  cancelWorkflowInstance(instanceId: string): Promise<WorkflowInstance>;
}
