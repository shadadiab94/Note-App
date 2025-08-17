export type Priority = "low" | "medium" | "high";

export interface Note {
  id: string;
  title: string;
  content: string;
  priority: Priority;
}
