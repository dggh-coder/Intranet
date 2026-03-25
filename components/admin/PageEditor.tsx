"use client";

import { useMemo, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { webPartRegistry } from "@/lib/webparts/registry";
import type { PageSection, WebPartType } from "@/lib/types";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string | null;
  seoDesc: string | null;
  pageLayout: PageSection[];
}

function SortableWebPart({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="rounded border bg-white p-3">
      <button type="button" {...attributes} {...listeners} className="mb-2 text-xs text-slate-500">↕ drag</button>
      {children}
    </div>
  );
}

export function PageEditor({ initial }: { initial: PageRecord }) {
  const [model, setModel] = useState<PageRecord>(initial);
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const canSave = useMemo(() => model.title.trim() && model.slug.trim(), [model]);

  const addSection = () => {
    setModel((prev) => ({
      ...prev,
      pageLayout: [...prev.pageLayout, { id: crypto.randomUUID(), columns: 1, webParts: [] }]
    }));
  };

  const addWebPart = (sectionId: string, type: WebPartType) => {
    setModel((prev) => ({
      ...prev,
      pageLayout: prev.pageLayout.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              webParts: [
                ...section.webParts,
                { id: crypto.randomUUID(), type, config: structuredClone(webPartRegistry[type].defaultConfig) }
              ]
            }
          : section
      )
    }));
  };

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/pages/${model.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model)
    });
    setSaving(false);
    if (!res.ok) alert("Save failed");
    else alert("Saved");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input className="rounded border p-2" value={model.title} onChange={(e) => setModel({ ...model, title: e.target.value })} placeholder="Page title" />
        <input className="rounded border p-2" value={model.slug} onChange={(e) => setModel({ ...model, slug: e.target.value })} placeholder="slug" />
        <select className="rounded border p-2" value={model.status} onChange={(e) => setModel({ ...model, status: e.target.value as any })}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <input className="rounded border p-2" value={model.seoTitle ?? ""} onChange={(e) => setModel({ ...model, seoTitle: e.target.value })} placeholder="SEO title" />
      </div>

      <div className="space-y-4">
        {model.pageLayout.map((section) => (
          <div key={section.id} className="rounded-xl border bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Section</span>
                <select
                  className="rounded border p-1 text-sm"
                  value={section.columns}
                  onChange={(e) =>
                    setModel((prev) => ({
                      ...prev,
                      pageLayout: prev.pageLayout.map((s) => (s.id === section.id ? { ...s, columns: Number(e.target.value) as 1 | 2 | 3 } : s))
                    }))
                  }
                >
                  <option value={1}>1 column</option>
                  <option value={2}>2 column</option>
                  <option value={3}>3 column</option>
                </select>
              </div>
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => setModel((prev) => ({ ...prev, pageLayout: prev.pageLayout.filter((s) => s.id !== section.id) }))}
              >
                Remove section
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;
                setModel((prev) => ({
                  ...prev,
                  pageLayout: prev.pageLayout.map((s) => {
                    if (s.id !== section.id) return s;
                    const oldIndex = s.webParts.findIndex((x) => x.id === active.id);
                    const newIndex = s.webParts.findIndex((x) => x.id === over.id);
                    return { ...s, webParts: arrayMove(s.webParts, oldIndex, newIndex) };
                  })
                }));
              }}
            >
              <SortableContext items={section.webParts.map((x) => x.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {section.webParts.map((webPart) => (
                    <SortableWebPart key={webPart.id} id={webPart.id}>
                      <div className="mb-2 text-sm font-medium">{webPartRegistry[webPart.type].label}</div>
                      <textarea
                        className="h-36 w-full rounded border p-2 font-mono text-xs"
                        value={JSON.stringify(webPart.config, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setModel((prev) => ({
                              ...prev,
                              pageLayout: prev.pageLayout.map((s) =>
                                s.id === section.id
                                  ? { ...s, webParts: s.webParts.map((w) => (w.id === webPart.id ? { ...w, config: parsed } : w)) }
                                  : s
                              )
                            }));
                          } catch {
                            // noop
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="mt-2 text-xs text-red-600"
                        onClick={() =>
                          setModel((prev) => ({
                            ...prev,
                            pageLayout: prev.pageLayout.map((s) =>
                              s.id === section.id ? { ...s, webParts: s.webParts.filter((w) => w.id !== webPart.id) } : s
                            )
                          }))
                        }
                      >
                        Remove web part
                      </button>
                    </SortableWebPart>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(webPartRegistry) as WebPartType[]).map((type) => (
                <button key={type} type="button" className="rounded border bg-white px-2 py-1 text-xs" onClick={() => addWebPart(section.id, type)}>
                  + {webPartRegistry[type].label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button type="button" className="rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={addSection}>Add section</button>
        <button disabled={!canSave || saving} type="button" className="rounded bg-brand px-3 py-2 text-sm text-white disabled:opacity-50" onClick={save}>
          {saving ? "Saving..." : "Save page"}
        </button>
      </div>
    </div>
  );
}
