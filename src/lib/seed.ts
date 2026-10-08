import type { Announcement, LessonChange, ScheduleSlot, User } from "../types";

export const STORAGE_KEYS = {
  users: "maktabhub.users",
  session: "maktabhub.session",
  schedule: "maktabhub.schedule",
  announcements: "maktabhub.announcements",
  changes: "maktabhub.changes",
  read: "maktabhub.read",
  theme: "maktabhub.theme",
  threads: "maktabhub.threads",
  messages: "maktabhub.messages",
  homework: "maktabhub.homework",
};

export const DEFAULT_CLASS = "10-A";

const TEACHER_BY_SUBJECT: Record<string, string> = {
  Matematika: "Karimova N.",
  "Ona tili": "Aliyeva M.",
  "Ingliz tili": "Smith J.",
  Fizika: "Rahimov B.",
  Kimyo: "Yusupova D.",
  Tarix: "Toshmatov A.",
  Biologiya: "Qodirov E.",
  Geografiya: "Ismoilova G.",
  Informatika: "Nazarov S.",
  "Jismoniy tarbiya": "Tursunov K.",
};

const ROOM_BY_SUBJECT: Record<string, string> = {
  Matematika: "201-xona",
  "Ona tili": "105-xona",
  "Ingliz tili": "302-xona",
  Fizika: "208-xona",
  Kimyo: "210-xona",
  Tarix: "112-xona",
  Biologiya: "115-xona",
  Geografiya: "118-xona",
  Informatika: "401-xona",
  "Jismoniy tarbiya": "Sport zali",
};

const WEEK_TEMPLATE: string[][] = [
  [
    "Matematika",
    "Ona tili",
    "Ingliz tili",
    "Fizika",
    "Kimyo",
    "Tarix",
    "Informatika",
  ],
  [
    "Matematika",
    "Ingliz tili",
    "Kimyo",
    "Ona tili",
    "Fizika",
    "Geografiya",
    "Jismoniy tarbiya",
  ],
  [
    "Ona tili",
    "Matematika",
    "Tarix",
    "Ingliz tili",
    "Biologiya",
    "Informatika",
    "Fizika",
  ],
  [
    "Fizika",
    "Kimyo",
    "Matematika",
    "Ona tili",
    "Informatika",
    "Tarix",
    "Jismoniy tarbiya",
  ],
  [
    "Ingliz tili",
    "Biologiya",
    "Ona tili",
    "Matematika",
    "Geografiya",
    "Kimyo",
    "Informatika",
  ],
  ["Tarix", "Geografiya", "Matematika", "Ingliz tili", "Biologiya"],
];

export function buildSchedule(className: string): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  WEEK_TEMPLATE.forEach((daySubjects, day) => {
    daySubjects.forEach((subject, index) => {
      slots.push({
        className,
        day,
        lesson: index + 1,
        subject,
        teacher: TEACHER_BY_SUBJECT[subject] ?? "",
        room: ROOM_BY_SUBJECT[subject] ?? "",
      });
    });
  });
  return slots;
}

export function seedUsers(): User[] {
  return [
    {
      id: "u-student",
      name: "Aziz Karimov",
      email: "student@maktab.uz",
      password: "12345",
      role: "student",
      className: "10-A",
    },
    {
      id: "u-teacher",
      name: "Malika Yusupova",
      email: "teacher@maktab.uz",
      password: "12345",
      role: "teacher",
      subject: "Matematika",
    },
    {
      id: "u-parent",
      name: "Ota-ona",
      email: "parent@maktab.uz",
      password: "12345",
      role: "parent",
      childName: "Aziz Karimov",
      childClass: "10-A",
    },
  ];
}

export function seedAnnouncements(): Announcement[] {
  return [
    {
      id: "a-1",
      title: "Olimpiada boshlanadi",
      text: "Matematika olimpiadasi 15-oktabrda bo'lib o'tadi. Ro'yxatdan o'tish uchun sinf rahbariga murojaat qiling!",
      category: "Tadbir",
      author: "Malika Yusupova",
      date: "2026-10-06",
    },
    {
      id: "a-2",
      title: "Fizika darsi bekor qilindi",
      text: "Ertaga 3-dars Fizika bekor qilindi. Qo'shimcha ma'lumot e'lonlar orqali beriladi.",
      category: "O'zgarish",
      author: "Rahimov B.",
      date: "2026-10-06",
    },
    {
      id: "a-3",
      title: "Chorak yakunlanishi",
      text: "1-chorak 25-oktabrda tugaydi. Baholaringizni tekshirib chiqing.",
      category: "Umumiy",
      author: "Malika Yusupova",
      date: "2026-10-05",
    },
    {
      id: "a-4",
      title: "Kitobxonlik haftaligi",
      text: "10-14-oktabr kunlari maktabda kitobxonlik haftaligi o'tkaziladi. Har bir o'quvchi kamida 2 ta kitob o'qishi kerak.",
      category: "Tadbir",
      author: "Aliyeva M.",
      date: "2026-10-04",
    },
    {
      id: "a-5",
      title: "Matematikadan oraliq imtihon",
      text: "17-oktabr kuni 4-darsda Matematikadan oraliq imtihon bo'ladi. Fanlar: sonlar nazariyasi, tenglamalar.",
      category: "Imtihon",
      author: "Karimova N.",
      date: "2026-10-03",
    },
    {
      id: "a-6",
      title: "Maktab kuni tadbiri",
      text: "25-oktabr kuni maktab kuni munosabati bilan bayram tadbiri bo'lib o'tadi. Barcha o'quvchilar va ota-onalar taklif qilinadi.",
      category: "Tadbir",
      author: "Malika Yusupova",
      date: "2026-10-01",
    },
    {
      id: "a-7",
      title: "Sog'liqni saqlash haftasi",
      text: "Maktabda sog'liqni saqlash haftasi doirasida tibbiy ko'rikdan o'tish rejalashtirilgan.",
      category: "Umumiy",
      author: "Malika Yusupova",
      date: "2026-09-28",
    },
  ];
}

export function seedChanges(): LessonChange[] {
  return [
    {
      id: "c-1",
      date: "2026-10-06",
      lessonNumber: 6,
      subject: "Tarix",
      oldValue: "Toshmatov A. / 112-xona",
      newValue: "Ismoilova G. / 112-xona",
      reason: "O'qituvchi almashdi",
    },
    {
      id: "c-2",
      date: "2026-10-07",
      lessonNumber: 3,
      subject: "Fizika",
      oldValue: "Rahimov B. / 208-xona",
      newValue: "Bekor qilindi",
      reason: "O'qituvchi kasal",
    },
    {
      id: "c-3",
      date: "2026-10-08",
      lessonNumber: 5,
      subject: "Kimyo",
      oldValue: "210-xona",
      newValue: "212-xona",
      reason: "Xona almashtirildi",
    },
    {
      id: "c-4",
      date: "2026-10-09",
      lessonNumber: 2,
      subject: "Ingliz tili",
      oldValue: "302-xona",
      newValue: "305-xona",
      reason: "Laboratoriya darsi",
    },
  ];
}
