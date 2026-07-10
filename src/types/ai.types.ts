export type AiTaskPriority = "critical" | "high" | "medium" | "low";

export type AiGeneratedTaskDraft = {
  title: string;
  description: string;
  priority: AiTaskPriority;
  estimatedHours: number | null;
  labels: string[];
  acceptanceCriteria: string[];
  definitionOfDone: string[];
};

export type AiGeneratedStoryDraft = {
  title: string;
  description: string;
  storyPoints: number | null;
  tasks: AiGeneratedTaskDraft[];
};

export type AiWorkBreakdownDraft = {
  epicTitle: string;
  epicSummary: string;
  stories: AiGeneratedStoryDraft[];
};

export type AiAcceptanceCriteriaDraft = {
  acceptanceCriteria: string[];
  definitionOfDone: string[];
  suggestedLabels: string[];
  suggestedPriority: AiTaskPriority | null;
  estimatedHours: number | null;
};

export type AiProjectSummaryDraft = {
  executiveSummary: string;
  healthScore: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  completedHighlights: string[];
  delayedItems: string[];
  risks: string[];
  recommendedNextActions: string[];
};

export type AiProjectFormDraft = {
  name: string;
  key: string;
  description: string;
  category: "marketing" | "engineering" | "design" | "product" | "operations";
  priority: "low" | "medium" | "high";
  startDate: string;
  dueDate: string;
  visibility: "private" | "public";
  leadUserId: string | null;
  memberIds: string[];
};

export type AiTaskFormDraft = {
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "critical" | "high" | "medium" | "low";
  estimatedHours: number | null;
  assigneeId: string | null;
  dueDate: string;
  labels: string[];
};

export type GenerateWorkBreakdownRequest = {
  projectId: string;
  requirement: string;
  language?: string;
};

export type GenerateProjectSummaryRequest = {
  projectId: string;
  language?: string;
};

export type GenerateProjectDraftRequest = {
  notes: string;
  projectName?: string;
  language?: string;
};

export type GenerateTaskDraftRequest = {
  projectId: string;
  notes: string;
  taskTitle?: string;
  language?: string;
};

export type DescribeActivityRequest = {
  activityId: string;
  language?: string;
};

export type AiActivityDescribeDraft = {
  headline: string;
  explanation: string;
  impact: string;
  suggestedFollowUp: string;
};

export type AiTaskTipDraft = {
  reason: string;
  nextStep: string;
};

export type AiMembershipImpactDraft = {
  headline: string;
  impact: string;
  caution: string;
};

export type AiCalendarDraft = {
  title: string;
  type: "team" | "deadline";
  description: string;
};

export type AiAskWorkspaceDraft = {
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: string[];
};

export type GenerateTaskTipRequest = {
  taskId: string;
  language?: string;
};

export type GenerateMembershipImpactRequest = {
  changeType: string;
  changeContext: string;
  language?: string;
};

export type GenerateCalendarDraftRequest = {
  notes: string;
  preferredTitle?: string;
  projectName?: string;
  language?: string;
};

export type AskWorkspaceRequest = {
  question: string;
  language?: string;
};

export type ApplyWorkBreakdownRequest = {
  projectId: string;
  updateProjectDescription?: boolean;
  tasks: Array<{
    title: string;
    description?: string;
    priority?: AiTaskPriority;
    estimatedHours?: number | null;
    labels?: string[];
    acceptanceCriteria?: string[];
    definitionOfDone?: string[];
  }>;
};

export type AiWorkBreakdownResponse = {
  message: string;
  draft: AiWorkBreakdownDraft;
};

export type AiProjectSummaryResponse = {
  message: string;
  draft: AiProjectSummaryDraft;
};

export type AiProjectDraftResponse = {
  message: string;
  draft: AiProjectFormDraft;
};

export type AiTaskDraftResponse = {
  message: string;
  draft: AiTaskFormDraft;
};

export type AiActivityDescribeResponse = {
  message: string;
  draft: AiActivityDescribeDraft;
};

export type AiTaskTipResponse = {
  message: string;
  draft: AiTaskTipDraft;
  triggerReason: string;
};

export type AiMembershipImpactResponse = {
  message: string;
  draft: AiMembershipImpactDraft;
};

export type AiCalendarDraftResponse = {
  message: string;
  draft: AiCalendarDraft;
};

export type AiAskWorkspaceResponse = {
  message: string;
  draft: AiAskWorkspaceDraft;
};

export type AiApplyWorkBreakdownResponse = {
  message: string;
  tasks: unknown[];
};
