export type HomeworkStatus = "pending" | "done";

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  title: string;
  dueDate: string;
  status: HomeworkStatus;
  createdAt: number;
}
