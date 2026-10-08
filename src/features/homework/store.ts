import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "../../lib/seed";
import { readJSON, uid, writeJSON } from "../../lib/store";
import type { Homework } from "./types";

export function todayISO(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function offsetISO(days: number, now: Date = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return todayISO(date);
}

export function dayDiff(dueDate: string, now: Date = new Date()): number {
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function relativeDue(dueDate: string, now: Date = new Date()): string {
  const diff = dayDiff(dueDate, now);
  if (diff === 0) return "Bugun";
  if (diff === 1) return "Ertaga";
  if (diff > 1) return `${diff} kundan keyin`;
  if (diff === -1) return "Kecha";
  return `${Math.abs(diff)} kun oldin`;
}

function seedHomework(): Homework[] {
  const now = Date.now();
  return [
    {
      id: "hw-1",
      classId: "10A",
      subject: "Matematika",
      title: "Ismli tenglamalar — 45–47 masalalar",
      dueDate: offsetISO(1),
      status: "pending",
      createdAt: now,
    },
    {
      id: "hw-2",
      classId: "10A",
      subject: "Ona tili",
      title: "D. Yusuf she'ridan to'rt band yodlash",
      dueDate: offsetISO(3),
      status: "pending",
      createdAt: now,
    },
    {
      id: "hw-3",
      classId: "10A",
      subject: "Fizika",
      title: "Mashq 12–15, savollar 1–5",
      dueDate: offsetISO(-1),
      status: "pending",
      createdAt: now,
    },
  ];
}

let state: Homework[] = readJSON<Homework[] | null>(STORAGE_KEYS.homework, null) ?? [];

if (state.length === 0 && localStorage.getItem(STORAGE_KEYS.homework) === null) {
  state = seedHomework();
  writeJSON(STORAGE_KEYS.homework, state);
}

const listeners = new Set<() => void>();

function setState(next: Homework[]): void {
  state = next;
  writeJSON(STORAGE_KEYS.homework, next);
  listeners.forEach((listener) => listener());
}

function subscribeHomework(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHomeworkState(): Homework[] {
  return state;
}

export function useHomeworkState(): Homework[] {
  return useSyncExternalStore(subscribeHomework, getHomeworkState);
}

export function addHomework(
  input: Omit<Homework, "id" | "createdAt" | "status">,
): void {
  const created: Homework = {
    ...input,
    id: uid("hw"),
    status: "pending",
    createdAt: Date.now(),
  };
  setState([created, ...state]);
}

export function toggleHomework(id: string): void {
  setState(
    state.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "done" ? "pending" : "done" }
        : item,
    ),
  );
}

export function removeHomework(id: string): void {
  setState(state.filter((item) => item.id !== id));
}
