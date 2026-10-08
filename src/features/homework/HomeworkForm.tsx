import { useState, type FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import { useScript } from "../../context/ScriptContext";
import Modal from "../../components/Modal";
import { SUBJECTS, classIdFromName } from "../../lib/constants";
import { addHomework, todayISO } from "./store";

export default function HomeworkForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { viewClassName, toast } = useApp();
  const { t } = useScript();
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSubject("");
    setTitle("");
    setDueDate("");
    setError(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!subject) {
      setError(t("Fan kiritilishi shart"));
      return;
    }
    if (!title.trim()) {
      setError(t("Mavzu kiritilishi shart"));
      return;
    }
    if (!dueDate) {
      setError(t("Muddatni tanlang"));
      return;
    }
    addHomework({
      classId: classIdFromName(viewClassName),
      subject,
      title: title.trim(),
      dueDate,
    });
    toast(t("Uy vazifasi qo'shildi!"));
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={t("Uy vazifasi qo'shish")}
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="btn-secondary"
          >
            {t("Bekor qilish")}
          </button>
          <button type="submit" form="homework-form" className="btn-primary">
            {t("Saqlash")}
          </button>
        </>
      }
    >
      <form id="homework-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">{t("Fan")}</label>
          <select
            className="input"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            <option value="">{t("Fanlang")}</option>
            {SUBJECTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">{t("Mavzu")}</label>
          <input
            className="input"
            placeholder={t("Mavzu kiriting")}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label className="field-label">{t("Muddat")}</label>
          <input
            type="date"
            min={todayISO()}
            className="input"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
