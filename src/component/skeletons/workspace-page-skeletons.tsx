import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";
import PageHeaderSkeleton from "./page-header-skeleton";
import { StatCardsGridSkeleton } from "./stat-card-skeleton";
import TableSkeleton from "./table-skeleton";
import ChartCardSkeleton, { PanelCardSkeleton } from "./chart-card-skeleton";

type WorkspacePageSkeletonProps = {
  className?: string;
};

function PageHeaderWithActionSkeleton({ className }: WorkspacePageSkeletonProps) {
  return <PageHeaderSkeleton showAction className={className} />;
}

function CalendarPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex gap-4 px-5 py-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Skeleton className="h-5 w-36" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((__, itemIndex) => (
                  <Skeleton key={itemIndex} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </aside>

        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-7 border-b border-border bg-background/80">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="mx-auto my-3 h-4 w-8" />
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: 42 }).map((_, index) => (
              <div key={index} className="min-h-24 border-b border-r border-border p-2 last:border-r-0">
                <Skeleton className="h-4 w-6" />
                {index % 5 === 0 ? <Skeleton className="mt-2 h-5 w-full rounded-md" /> : null}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function DashboardPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <StatCardsGridSkeleton count={4} className="mb-6" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCardSkeleton tall />
        </div>
        <PanelCardSkeleton lines={4} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PanelCardSkeleton lines={3} />
        <PanelCardSkeleton lines={3} />
        <PanelCardSkeleton lines={4} />
      </div>
    </div>
  );
}

function BoardsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderSkeleton showAction={false} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <div className="flex -space-x-2">
                {Array.from({ length: 4 }).map((__, avatarIndex) => (
                  <Skeleton key={avatarIndex} className="h-8 w-8 rounded-full" />
                ))}
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="ml-auto h-3 w-20" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ReportsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderSkeleton showAction={false} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-9 w-16" />
          </article>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PanelCardSkeleton lines={5} />
        <PanelCardSkeleton lines={4} />
      </div>
    </div>
  );
}

function ProjectsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderWithActionSkeleton className="mb-6" />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="ml-auto h-10 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-5 flex items-center justify-between">
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }).map((__, avatarIndex) => (
                  <Skeleton key={avatarIndex} className="h-8 w-8 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type TableListPageSkeletonProps = WorkspacePageSkeletonProps & {
  columns?: number;
  rows?: number;
};

function TableListPageSkeleton({
  className,
  columns = 6,
  rows = 8,
}: TableListPageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderWithActionSkeleton className="mb-6" />
      <TableSkeleton rows={rows} columns={columns} showToolbar />
    </div>
  );
}

function TeamsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderWithActionSkeleton className="mb-6" />
      <TableSkeleton rows={8} columns={7} showToolbar />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-8 w-32" />
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
          </article>
        ))}
      </div>
    </div>
  );
}

function MyTasksPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: sectionIndex === 2 ? 2 : 3 }).map((__, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function KanbanBoardSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: 4 }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="w-[280px] shrink-0 rounded-2xl border border-border bg-background/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-8 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: columnIndex === 1 ? 3 : 2 }).map((__, cardIndex) => (
                <article key={cardIndex} className="rounded-xl border border-border bg-card p-3 shadow-sm">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-3 w-2/3" />
                  <div className="mt-3 flex items-center justify-between">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64 max-w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <PanelCardSkeleton lines={4} />
          <PanelCardSkeleton lines={5} />
          <PanelCardSkeleton lines={6} />
        </div>
        <div className="space-y-6">
          <PanelCardSkeleton lines={4} />
          <PanelCardSkeleton lines={3} />
          <PanelCardSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
}

function TaskDetailSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <PanelCardSkeleton lines={6} />
          <PanelCardSkeleton lines={3} />
        </div>
        <PanelCardSkeleton lines={8} />
      </div>
    </div>
  );
}

function FormPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-3xl", className)}>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-48" />
      </div>
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </article>
    </div>
  );
}

function SettingsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderSkeleton showAction={false} className="mb-6" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 space-y-2 lg:w-60 xl:w-64">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-full rounded-xl" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <PanelCardSkeleton lines={4} />
          <PanelCardSkeleton lines={3} />
        </div>
      </div>
    </div>
  );
}

function ActivityLogsPageSkeleton({ className }: WorkspacePageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)}>
      <PageHeaderSkeleton showAction={false} className="mb-6" />
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <TableSkeleton rows={10} columns={5} showToolbar={false} />
      </article>
    </div>
  );
}

export {
  ActivityLogsPageSkeleton,
  BoardsPageSkeleton,
  CalendarPageSkeleton,
  DashboardPageSkeleton,
  FormPageSkeleton,
  KanbanBoardSkeleton,
  MyTasksPageSkeleton,
  ProjectDetailSkeleton,
  ProjectsPageSkeleton,
  ReportsPageSkeleton,
  SettingsPageSkeleton,
  TableListPageSkeleton,
  TaskDetailSkeleton,
  TeamsPageSkeleton,
};
