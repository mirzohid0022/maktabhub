import type { Role } from "../../types";

export type MessageStatus = "pending" | "approved" | "rejected";

export interface Thread {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  parentId?: string;
  teacherId?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  text: string;
  createdAt: number;
  status: MessageStatus;
}
