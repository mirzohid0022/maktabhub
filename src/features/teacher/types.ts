export type Room = {
  id: string;
  name: string;
  floor: number;
};

export type Lesson = {
  id: string;
  teacherId: string;
  classId: string;
  subject: string;
  weekday: 1 | 2 | 3 | 4 | 5;
  startTime: string;
  endTime: string;
  roomId: string;
};

export type TeacherMeeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  roomId: string;
  forRole: "teacher";
};

export type SchoolInfo = {
  directorRoom: string;
  directorHours: string;
  staffRoomId: string;
};

export type TeacherData = {
  rooms: Room[];
  lessons: Lesson[];
  meetings: TeacherMeeting[];
  schoolInfo: SchoolInfo;
};
