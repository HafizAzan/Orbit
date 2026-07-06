import type { CalendarEvent } from "../../../data/workspace-calendar";

export type CalendarEventInteractionProps = {
  currentUserId?: string;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
};
