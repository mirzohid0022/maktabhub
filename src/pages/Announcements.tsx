import { useMemo, useState, type FormEvent } from "react";
import {
  Check,
  CheckCheck,
  Megaphone,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, EmptyState, PageHeader, Skeleton } from "../components/ui";
import { BellIllo, SearchIllo } from "../components/Illustrations";
import Modal from "../components/Modal";
import { useDelay } from "../lib/store";
import { formatShortDate, todayKey } from "../lib/dates";
import { CATEGORIES, CATEGORY_STYLE } from "../lib/constants";
import { initials } from "../lib/store";
import type { Announcement, Category } from "../types";

export default function Announcements() {
  const {
    announcements,
    canEdit,
    user,
    addAnnouncement,
    deleteAnnouncement,
    toggleRead,
    readIds,
    toast,
  } = useApp();
  const loading = useDelay(450);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Barchasi" | Category>("Barchasi");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Umumiy");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...announcements]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((item) => {
        const matchesCategory =
          category === "Barchasi" || item.category === category;
        const matchesQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.text.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
  }, [announcements, query, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !text.trim()) {
      toast("Sarlavha va matnni to'ldiring.", "error");
      return;
    }
    addAnnouncement({
      title: title.trim(),
      text: text.trim(),
      category: newCategory,
      author: user?.name ?? "Ma'muriyat",
      date: todayKey(),
    });
    setTitle("");
    setText("");
    setNewCategory("Umumiy");
    setModalOpen(false);
  };

  const chips: ("Barchasi" | Category)[] = ["Barchasi", ...CATEGORIES];

  return (
    <div>
      <PageHeader
        kicker="Maktab yangiliklari"
        title="E'lonlar"
        subtitle={`Maktabdan ${announcements.length} ta e'lon · o'qilmaganlari belgilangan`}
        actions={
          canEdit ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setModalOpen(true)}
            >
              <Plus size={16} /> Yangi e'lon qo'shish
            </button>
          ) : null
        }
      />

      <Card className="mb-5" bodyClassName="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="E'lonlarni qidirish... (sarlavha, matn, muallif)"
            className="input pl-10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
            >
              Tozalash
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {chips.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                category === item
                  ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={26} />}
          title={query ? "Hech narsa topilmadi" : "Hozircha e'lonlar yo'q"}
          description={
            query
              ? "Qidiruvga mos e'lon topilmadi. Boshqa kalit so'z bilan urinib ko'ring."
              : "Maktabdan yangi e'lonlar shu yerda paydo bo'ladi."
          }
          illo={
            query ? (
              <SearchIllo className="w-full" />
            ) : (
              <BellIllo className="w-full" />
            )
          }
          action={
            query ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("Barchasi");
                }}
              >
                Filtrlarni tozalash
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="stagger grid gap-4">
          {featured ? (
            <Card
              className="group border-blue-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float dark:border-blue-500/25"
              title={
                <h2 className="text-xl leading-snug font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                  {featured.title}
                </h2>
              }
              badge={
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                    <Sparkles size={12} /> So'nggi
                  </span>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${CATEGORY_STYLE[featured.category] ?? CATEGORY_STYLE.Umumiy}`}
                  >
                    {featured.category}
                  </span>
                  {!readIds.includes(featured.id) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                      Yangi
                    </span>
                  ) : null}
                </>
              }
              action={
                !canEdit ? (
                  <button
                    type="button"
                    onClick={() => toggleRead(featured.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      readIds.includes(featured.id)
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    }`}
                  >
                    {readIds.includes(featured.id) ? (
                      <span className="check-pop inline-flex items-center gap-1.5">
                        <CheckCheck size={14} /> O'qildi
                      </span>
                    ) : (
                      <>
                        <Check size={14} /> O'qildi deb belgilash
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => deleteAnnouncement(featured.id)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800"
                    title="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                )
              }
            >
              <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {featured.text}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {initials(featured.author)}
                  </span>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {featured.author}
                    </p>
                    <p className="text-slate-400">
                      {formatShortDate(featured.date)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {rest.map((item: Announcement) => {
                const read = readIds.includes(item.id);
                return (
                  <Card
                    key={item.id}
                    className={`group flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float ${read ? "opacity-80" : ""}`}
                    title={item.title}
                    badge={
                      <span
                        className={`inline-flex shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.Umumiy}`}
                      >
                        {item.category}
                      </span>
                    }
                    action={
                      <>
                        {!read && !canEdit ? (
                          <span
                            className="h-2 w-2 rounded-full bg-blue-500"
                            title="O'qilmagan"
                          />
                        ) : null}
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => deleteAnnouncement(item.id)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </>
                    }
                    bodyClassName="flex flex-1 flex-col"
                  >
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {initials(item.author)}
                        </span>
                        <div className="text-[11px] leading-tight">
                          <p className="font-semibold text-slate-600 dark:text-slate-300">
                            {item.author}
                          </p>
                          <p className="text-slate-400">
                            {formatShortDate(item.date)}
                          </p>
                        </div>
                      </div>

                      {!canEdit ? (
                        <button
                          type="button"
                          onClick={() => toggleRead(item.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                            read
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          <Check size={12} />
                          {read ? "O'qildi" : "O'qish"}
                        </button>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      )}

      <Modal
        open={modalOpen}
        title="Yangi e'lon"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Bekor qilish
            </button>
            <button type="button" className="btn-primary" onClick={submit}>
              <Plus size={15} /> E'lon qo'shish
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Sarlavha</label>
            <input
              className="input"
              placeholder="Masalan: Olimpiada boshlanadi"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Matn</label>
            <textarea
              className="input min-h-32 resize-y"
              placeholder="E'lon matnini yozing..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Kategoriya</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNewCategory(item)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    newCategory === item
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            <Megaphone size={14} className="shrink-0 text-blue-500" />
            Muallif: <strong>{user?.name}</strong> · Sana:{" "}
            <strong>{formatShortDate(todayKey())}</strong>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
}
