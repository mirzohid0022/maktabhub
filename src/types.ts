export type Role = "student" | "teacher" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  className?: string;
  subject?: string;
  childName?: string;
  childClass?: string;
}

export interface Lesson {
  subject: string;
  teacher: string;
  room: string;
}

export interface ScheduleSlot extends Lesson {
  day: number;
  lesson: number;
  className: string;
}

export type Category = "Umumiy" | "Tadbir" | "Imtihon" | "O'zgarish";

export interface Announcement {
  id: string;
  title: string;
  text: string;
  category: Category;
  author: string;
  date: string;
}

export interface LessonChange {
  id: string;
  date: string;
  lessonNumber: number;
  subject: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  lessons?: LessonRow[];
}

export interface LessonRow {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}
