import { useMemo, useState } from "react";
import { NotebookPen, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";
import { PageHeader } from "../components/ui";
import HomeworkForm from "../features/homework/HomeworkForm";
import HomeworkList from "../features/homework/HomeworkList";
import { useHomeworkState } from "../features/homework/store";
import { classIdFromName } from "../lib/constants";

export default function HomeworkPage() {
  const { user, viewClassName, canEdit } = useApp();
  const { t } = useScript();
  const homework = useHomeworkState();
  const [formOpen, setFormOpen] = useState(false);

  const classId = classIdFromName(viewClassName);
  const items = useMemo(
    () => homework.filter((item) => item.classId === classId),
    [homework, classId],
  );

  if (!user) return null;

  return (
    <div className="page-enter">
      <PageHeader
        kicker="MaktabHub"
        title="Uy vazifalari"
        subtitle={`${viewClassName} · ${t("fanlar bo'yicha uy vazifalari va muddatlari")}`}
        actions={
          canEdit ? (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              {t("Qo'shish")}
            </button>
          ) : null
        }
      />

      <HomeworkList items={items} canEdit={canEdit} />

      <HomeworkForm open={formOpen} onClose={() => setFormOpen(false)} />

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <NotebookPen size={14} />
        {t("Uy vazifalari sinf bo'yicha saqlanadi")}
      </p>
    </div>
  );
}
