import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Announcement,
  LessonChange,
  Role,
  ScheduleSlot,
  User,
} from "../types";
import {
  DEFAULT_CLASS,
  STORAGE_KEYS,
  buildSchedule,
  seedAnnouncements,
  seedChanges,
  seedUsers,
} from "../lib/seed";
import { readJSON, uid, writeJSON } from "../lib/store";
import ToastViewport, { type ToastItem, type ToastType } from "../components/ToastViewport";
import ConfirmDialog, { type ConfirmRequest } from "../components/ConfirmDialog";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  className?: string;
  subject?: string;
  childName?: string;
  childClass?: string;
}

interface AppContextValue {
  user: User | null;
  users: User[];
  viewClassName: string;
  canEdit: boolean;
  theme: "light" | "dark";
  schedule: ScheduleSlot[];
  announcements: Announcement[];
  changes: LessonChange[];
  readIds: string[];
  unreadCount: number;
  login: (email: string, password: string, role: Role) => string | null;
  register: (input: RegisterInput) => string | null;
  logout: () => void;
  toggleTheme: () => void;
  saveSlot: (slot: ScheduleSlot) => void;
  addAnnouncement: (input: Omit<Announcement, "id">) => void;
  deleteAnnouncement: (id: string) => void;
  toggleRead: (id: string) => void;
  addChange: (input: Omit<LessonChange, "id">) => void;
  deleteChange: (id: string) => void;
  resetDemoData: () => void;
  toast: (text: string, type?: ToastType) => void;
  confirm: (request: ConfirmRequest) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

function ensureSeed() {
  const writeIfMissing = <T,>(key: string, value: T) => {
    if (localStorage.getItem(key) === null) writeJSON(key, value);
  };
  writeIfMissing(STORAGE_KEYS.users, seedUsers());
  writeIfMissing(STORAGE_KEYS.schedule, buildSchedule(DEFAULT_CLASS));
  writeIfMissing(STORAGE_KEYS.announcements, seedAnnouncements());
  writeIfMissing(STORAGE_KEYS.changes, seedChanges());
  writeIfMissing(STORAGE_KEYS.read, {} as Record<string, string[]>);
}

ensureSeed();

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() =>
    readJSON(STORAGE_KEYS.users, seedUsers()),
  );
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() =>
    readJSON(STORAGE_KEYS.schedule, buildSchedule(DEFAULT_CLASS)),
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    readJSON(STORAGE_KEYS.announcements, seedAnnouncements()),
  );
  const [changes, setChanges] = useState<LessonChange[]>(() =>
    readJSON(STORAGE_KEYS.changes, seedChanges()),
  );
  const [readMap, setReadMap] = useState<Record<string, string[]>>(() =>
    readJSON(STORAGE_KEYS.read, {} as Record<string, string[]>),
  );
  const [userId, setUserId] = useState<string | null>(() =>
    readJSON<string | null>(STORAGE_KEYS.session, null),
  );
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = readJSON<"light" | "dark">(STORAGE_KEYS.theme, "light");
    return stored;
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    writeJSON(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const user = useMemo(
    () => users.find((item) => item.id === userId) ?? null,
    [users, userId],
  );

  const viewClassName =
    user?.role === "student"
      ? (user.className ?? DEFAULT_CLASS)
      : user?.role === "parent"
        ? (user.childClass ?? DEFAULT_CLASS)
        : DEFAULT_CLASS;

  const toast = useCallback((text: string, type: ToastType = "success") => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const confirm = useCallback((request: ConfirmRequest) => {
    setConfirmRequest(request);
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  }, []);

  const closeConfirm = useCallback((result: boolean) => {
    confirmResolver.current?.(result);
    confirmResolver.current = null;
    setConfirmRequest(null);
  }, []);

  const login = useCallback(
    (email: string, password: string, role: Role): string | null => {
      const found = users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) return "Bunday email bilan hisob topilmadi.";
      if (found.password !== password) return "Parol noto'g'ri kiritildi.";
      if (found.role !== role) return "Tanlangan rol hisobingizga mos kelmadi.";
      setUserId(found.id);
      writeJSON(STORAGE_KEYS.session, found.id);
      return null;
    },
    [users],
  );

  const register = useCallback(
    (input: RegisterInput): string | null => {
      const email = input.email.trim().toLowerCase();
      if (!input.name.trim()) return "Ismingizni kiriting.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email noto'g'ri formatda.";
      if (input.password.length < 4)
        return "Parol kamida 4 ta belgidan iborat bo'lishi kerak.";
      if (users.some((item) => item.email.toLowerCase() === email))
        return "Bu email allaqachon ro'yxatdan o'tgan.";
      const created: User = {
        id: uid("u"),
        name: input.name.trim(),
        email,
        password: input.password,
        role: input.role,
        className: input.role === "student" ? input.className : undefined,
        subject: input.role === "teacher" ? input.subject : undefined,
        childName: input.role === "parent" ? input.childName : undefined,
        childClass: input.role === "parent" ? input.childClass : undefined,
      };
      const next = [...users, created];
      setUsers(next);
      writeJSON(STORAGE_KEYS.users, next);
      setUserId(created.id);
      writeJSON(STORAGE_KEYS.session, created.id);
      return null;
    },
    [users],
  );

  const logout = useCallback(() => {
    setUserId(null);
    writeJSON(STORAGE_KEYS.session, null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const saveSlot = useCallback((slot: ScheduleSlot) => {
    setSchedule((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.className === slot.className &&
          item.day === slot.day &&
          item.lesson === slot.lesson,
      );
      const next =
        index === -1
          ? [...prev, slot]
          : prev.map((item, i) => (i === index ? slot : item));
      writeJSON(STORAGE_KEYS.schedule, next);
      return next;
    });
    toast("Dars saqlandi!");
  }, [toast]);

  const addAnnouncement = useCallback(
    (input: Omit<Announcement, "id">) => {
      const next = [{ ...input, id: uid("a") }, ...announcements];
      setAnnouncements(next);
      writeJSON(STORAGE_KEYS.announcements, next);
      toast("E'lon qo'shildi!");
    },
    [announcements, toast],
  );

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      const ok = await confirm({
        title: "E'lonni o'chirish",
        message: "Ushbu e'lon butunlay o'chirilishini tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.",
        confirmLabel: "O'chirish",
      });
      if (!ok) return;
      const next = announcements.filter((item) => item.id !== id);
      setAnnouncements(next);
      writeJSON(STORAGE_KEYS.announcements, next);
      toast("E'lon o'chirildi", "info");
    },
    [announcements, confirm, toast],
  );

  const toggleRead = useCallback(
    (id: string) => {
      if (!user) return;
      setReadMap((prev) => {
        const current = prev[user.id] ?? [];
        const nextList = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
        const next = { ...prev, [user.id]: nextList };
        writeJSON(STORAGE_KEYS.read, next);
        return next;
      });
    },
    [user],
  );

  const addChange = useCallback(
    (input: Omit<LessonChange, "id">) => {
      const next = [...changes, { ...input, id: uid("c") }].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      setChanges(next);
      writeJSON(STORAGE_KEYS.changes, next);
      toast("O'zgarish qo'shildi!");
    },
    [changes, toast],
  );

  const deleteChange = useCallback(
    async (id: string) => {
      const ok = await confirm({
        title: "O'zgarishni o'chirish",
        message: "Ushbu yozuv o'chirilsinmi?",
        confirmLabel: "O'chirish",
      });
      if (!ok) return;
      const next = changes.filter((item) => item.id !== id);
      setChanges(next);
      writeJSON(STORAGE_KEYS.changes, next);
      toast("O'zgarish o'chirildi", "info");
    },
    [changes, confirm, toast],
  );

  const resetDemoData = useCallback(async () => {
    const ok = await confirm({
      title: "Namuna ma'lumotlarni tiklash",
      message:
        "Jadval, e'lonlar va o'zgarishlar boshlang'ich holatga qaytariladi. Siz qo'shgan ma'lumotlar yo'qoladi.",
      confirmLabel: "Tiklash",
    });
    if (!ok) return;
    const nextSchedule = buildSchedule(DEFAULT_CLASS);
    const nextAnnouncements = seedAnnouncements();
    const nextChanges = seedChanges();
    setSchedule(nextSchedule);
    setAnnouncements(nextAnnouncements);
    setChanges(nextChanges);
    writeJSON(STORAGE_KEYS.schedule, nextSchedule);
    writeJSON(STORAGE_KEYS.announcements, nextAnnouncements);
    writeJSON(STORAGE_KEYS.changes, nextChanges);
    toast("Namuna ma'lumotlar tiklandi!");
  }, [confirm, toast]);

  const readIds = user ? (readMap[user.id] ?? []) : [];
  const unreadCount = useMemo(
    () => announcements.filter((item) => !readIds.includes(item.id)).length,
    [announcements, readIds],
  );

  const value: AppContextValue = {
    user,
    users,
    viewClassName,
    canEdit: user?.role === "teacher",
    theme,
    schedule,
    announcements,
    changes,
    readIds,
    unreadCount,
    login,
    register,
    logout,
    toggleTheme,
    saveSlot,
    addAnnouncement,
    deleteAnnouncement,
    toggleRead,
    addChange,
    deleteChange,
    resetDemoData,
    toast,
    confirm,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
      <ConfirmDialog
        request={confirmRequest}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp is only available inside AppProvider");
  return ctx;
}
