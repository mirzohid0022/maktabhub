import { toDateKey } from "../../lib/dates";
import { readJSON, writeJSON } from "../../lib/store";
import type {
  Lesson,
  Room,
  SchoolInfo,
  TeacherData,
  TeacherMeeting,
} from "./types";

export const TEACHER_STORAGE_KEY = "maktabhub.teacher";

export const TEACHER_ID = "t1";

function nextWeekdayKey(target: number, from: Date): string {
  const delta = (target - from.getDay() + 7) % 7;
  return toDateKey(
    new Date(from.getFullYear(), from.getMonth(), from.getDate() + delta),
  );
}

function seedData(): TeacherData {
  const now = new Date();

  const rooms: Room[] = [
    { id: "r101", name: "101-xona", floor: 1 },
    { id: "r204", name: "204-xona (Ona tili)", floor: 2 },
    { id: "r305", name: "305-xona (Adabiyot)", floor: 3 },
    { id: "staff", name: "O'qituvchilar xonasi", floor: 1 },
    { id: "dir", name: "Direktor xonasi", floor: 1 },
  ];

  const lessons: Lesson[] = [
    {
      id: "l1",
      teacherId: TEACHER_ID,
      classId: "10-A",
      subject: "Ona tili",
      weekday: 1,
      startTime: "08:30",
      endTime: "09:15",
      roomId: "r204",
    },
    {
      id: "l2",
      teacherId: TEACHER_ID,
      classId: "9-B",
      subject: "Ona tili",
      weekday: 1,
      startTime: "09:25",
      endTime: "10:10",
      roomId: "r204",
    },
    {
      id: "l3",
      teacherId: TEACHER_ID,
      classId: "11-A",
      subject: "Adabiyot",
      weekday: 2,
      startTime: "10:20",
      endTime: "11:05",
      roomId: "r305",
    },
    {
      id: "l4",
      teacherId: TEACHER_ID,
      classId: "10-A",
      subject: "Ona tili",
      weekday: 3,
      startTime: "08:30",
      endTime: "09:15",
      roomId: "r204",
    },
    {
      id: "l5",
      teacherId: TEACHER_ID,
      classId: "9-B",
      subject: "Adabiyot",
      weekday: 4,
      startTime: "11:15",
      endTime: "12:00",
      roomId: "r204",
    },
    {
      id: "l6",
      teacherId: TEACHER_ID,
      classId: "11-A",
      subject: "Adabiyot",
      weekday: 5,
      startTime: "09:25",
      endTime: "10:10",
      roomId: "r305",
    },
  ];

  const meetings: TeacherMeeting[] = [
    {
      id: "m1",
      title: "Metodik kengash",
      date: nextWeekdayKey(5, now),
      time: "15:00",
      roomId: "staff",
      forRole: "teacher",
    },
  ];

  const schoolInfo: SchoolInfo = {
    directorRoom: "dir",
    directorHours: "Dushanba–Juma, 09:00–17:00",
    staffRoomId: "staff",
  };

  return { rooms, lessons, meetings, schoolInfo };
}

function isValid(data: unknown): data is TeacherData {
  const candidate = data as TeacherData | null;
  return Boolean(
    candidate &&
      Array.isArray(candidate.rooms) &&
      candidate.rooms.length > 0 &&
      Array.isArray(candidate.lessons) &&
      candidate.lessons.length > 0 &&
      Array.isArray(candidate.meetings) &&
      candidate.schoolInfo &&
      typeof candidate.schoolInfo.directorRoom === "string",
  );
}

export function loadTeacherData(): TeacherData {
  const stored = readJSON<TeacherData | null>(TEACHER_STORAGE_KEY, null);
  if (isValid(stored)) return stored;
  const seeded = seedData();
  writeJSON(TEACHER_STORAGE_KEY, seeded);
  return seeded;
}

export function getRoom(roomId: string): Room | undefined {
  return loadTeacherData().rooms.find((room) => room.id === roomId);
}

export function getSchoolInfo(): SchoolInfo {
  return loadTeacherData().schoolInfo;
}

export function getTeacherLessons(teacherId: string): Lesson[] {
  return loadTeacherData()
    .lessons.filter((lesson) => lesson.teacherId === teacherId)
    .sort(
      (a, b) =>
        a.weekday - b.weekday || a.startTime.localeCompare(b.startTime),
    );
}

export function getTeacherClasses(teacherId: string): string[] {
  const classes = new Set<string>();
  for (const lesson of getTeacherLessons(teacherId)) {
    classes.add(lesson.classId);
  }
  return [...classes].sort();
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function getNextLesson(teacherId: string, now: Date): Lesson | null {
  const lessons = getTeacherLessons(teacherId);
  if (lessons.length === 0) return null;
  const jsDay = now.getDay();
  const weekday = jsDay === 0 ? 7 : jsDay;
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const lesson of lessons) {
    if (lesson.weekday > weekday) return lesson;
    if (lesson.weekday === weekday && toMinutes(lesson.startTime) > minutes) {
      return lesson;
    }
  }
  return lessons[0];
}

export function getUpcomingMeetings(now: Date): TeacherMeeting[] {
  const today = toDateKey(now);
  return loadTeacherData()
    .meetings.filter(
      (meeting) => meeting.forRole === "teacher" && meeting.date >= today,
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}
