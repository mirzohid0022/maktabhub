import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "../../lib/seed";
import { classIdFromName } from "../../lib/constants";
import { readJSON, uid, writeJSON } from "../../lib/store";
import type { Role, User } from "../../types";
import type { Message, MessageStatus, Thread } from "./types";

export const DENIED_TEXT = "Bu bo'lim faqat ota-onalar va o'qituvchilar uchun";

interface MessagesState {
  threads: Thread[];
  messages: Message[];
}

function seedThreads(): Thread[] {
  return [
    {
      id: "thread-s1",
      studentId: "s1",
      studentName: "Ali Valiyev",
      classId: "10A",
      parentId: "p1",
      teacherId: "t1",
      createdAt: Date.now(),
    },
  ];
}

function loadState(): MessagesState {
  const threads = readJSON<Thread[] | null>(STORAGE_KEYS.threads, null);
  const messages = readJSON<Message[] | null>(STORAGE_KEYS.messages, null);
  const next: MessagesState = {
    threads: threads ?? seedThreads(),
    messages: messages ?? [],
  };
  if (threads === null || threads === undefined) {
    writeJSON(STORAGE_KEYS.threads, next.threads);
  }
  if (messages === null || messages === undefined) {
    writeJSON(STORAGE_KEYS.messages, next.messages);
  }
  return next;
}

let state: MessagesState = loadState();

const listeners = new Set<() => void>();

function setState(next: MessagesState): void {
  state = next;
  writeJSON(STORAGE_KEYS.threads, next.threads);
  writeJSON(STORAGE_KEYS.messages, next.messages);
  listeners.forEach((listener) => listener());
}

function subscribeMessages(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMessagesState(): MessagesState {
  return state;
}

export function useMessagesState(): MessagesState {
  return useSyncExternalStore(subscribeMessages, getMessagesState);
}

function replaceThread(thread: Thread): void {
  setState({
    ...state,
    threads: state.threads.map((item) => (item.id === thread.id ? thread : item)),
  });
}

export function ensureThread(user: User): string {
  const { threads } = state;

  if (user.role === "student") {
    const found = threads.find((item) => item.studentId === user.id);
    if (found) return found.id;
    const created: Thread = {
      id: uid("thread"),
      studentId: user.id,
      studentName: user.name,
      classId: classIdFromName(user.className ?? "10-A"),
      createdAt: Date.now(),
    };
    setState({ ...state, threads: [...threads, created] });
    return created.id;
  }

  if (user.role === "parent") {
    const mine = threads.find((item) => item.parentId === user.id);
    if (mine) return mine.id;
    const childName = user.childName ?? "";
    const byChild = childName
      ? threads.find((item) => item.studentName === childName)
      : undefined;
    if (byChild) {
      replaceThread({ ...byChild, parentId: user.id });
      return byChild.id;
    }
    const created: Thread = {
      id: uid("thread"),
      studentId: uid("s"),
      studentName: childName || "Farzand",
      classId: classIdFromName(user.childClass ?? "10-A"),
      parentId: user.id,
      createdAt: Date.now(),
    };
    setState({ ...state, threads: [...threads, created] });
    return created.id;
  }

  const assigned = threads.find((item) => item.teacherId === user.id);
  if (assigned) return assigned.id;
  if (threads.length > 0) return threads[0].id;
  const created: Thread = {
    id: uid("thread"),
    studentId: uid("s"),
    studentName: "O'quvchi",
    classId: "10A",
    teacherId: user.id,
    createdAt: Date.now(),
  };
  setState({ ...state, threads: [...threads, created] });
  return created.id;
}

export function getMessages(threadId: string, viewerRole: Role): Message[] {
  return state.messages
    .filter((item) => item.threadId === threadId)
    .filter((item) => {
      if (viewerRole === "teacher") return true;
      if (item.status === "approved") return true;
      if (viewerRole === "parent" && item.authorRole === "parent") return true;
      return false;
    })
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function sendMessage(
  threadId: string,
  author: User,
  text: string,
): MessageStatus {
  const status: MessageStatus = author.role === "teacher" ? "approved" : "pending";
  const message: Message = {
    id: uid("m"),
    threadId,
    authorId: author.id,
    authorName: author.name,
    authorRole: author.role,
    text: text.trim(),
    createdAt: Date.now(),
    status,
  };
  setState({ ...state, messages: [...state.messages, message] });
  return status;
}

export function moderateMessage(id: string, status: MessageStatus): void {
  setState({
    ...state,
    messages: state.messages.map((item) =>
      item.id === id ? { ...item, status } : item,
    ),
  });
}

export function pendingMessages(): Message[] {
  return state.messages.filter((item) => item.status === "pending");
}
