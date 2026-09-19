"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatFileSize, materialKind, type StudyMaterial } from "@/lib/study-materials-shared";

type Notice = { type: "success" | "error"; message: string } | null;

export function StudyMaterialsManager({ materials }: { materials: StudyMaterial[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  async function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setNotice(null);
    try {
      const response = await fetch("/api/admin/study-materials", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      setNotice({ type: response.ok ? "success" : "error", message: result.message });
      if (response.ok) { form.reset(); router.refresh(); }
    } catch {
      setNotice({ type: "error", message: "The upload request could not be completed." });
    } finally {
      setBusy(false);
    }
  }

  async function updateMaterial(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault(); setBusy(true); setNotice(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/study-materials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, title: form.get("title"), description: form.get("description"), course: form.get("course"), category: form.get("category"), isPublished: form.get("isPublished") === "on" }) });
    const result = await response.json(); setNotice({ type: response.ok ? "success" : "error", message: result.message });
    if (response.ok) router.refresh(); setBusy(false);
  }

  async function deleteMaterial(id: string, title: string) {
    if (!window.confirm(`Delete “${title}” and its stored file?`)) return;
    setBusy(true); setNotice(null);
    const response = await fetch("/api/admin/study-materials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const result = await response.json(); setNotice({ type: response.ok ? "success" : "error", message: result.message });
    if (response.ok) router.refresh(); setBusy(false);
  }

  return <div className="admin-materials-manager">
    {notice && <p className={`admin-notice admin-notice-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p>}
    <form className="admin-upload" onSubmit={submitUpload}><div className="admin-form-heading"><span>New resource</span><h2>Upload study material</h2><p>PDF or DOCX, up to 25 MB. Files remain private.</p></div><div className="admin-form-grid"><label><span>Title</span><input name="title" maxLength={180} required /></label><label><span>Course</span><input name="course" maxLength={120} required /></label><label><span>Category</span><input name="category" maxLength={120} /></label><label className="admin-file"><span>Document</span><input name="file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /></label><label className="admin-description"><span>Description</span><textarea name="description" maxLength={2000} rows={4} /></label><label className="admin-check"><input name="isPublished" type="checkbox" /><span>Publish immediately</span></label></div><button className="button button-primary" disabled={busy}>{busy ? "Working…" : "Upload material"}</button></form>
    <section className="admin-material-list"><div className="admin-form-heading"><span>Library</span><h2>All materials</h2><p>{materials.length} material{materials.length === 1 ? "" : "s"}</p></div>{materials.length ? materials.map((material) => <details className="admin-material" key={material.id}><summary><span className={`admin-publish-state ${material.is_published ? "published" : "draft"}`}>{material.is_published ? "Published" : "Draft"}</span><div><strong>{material.title}</strong><small>{material.course} · {materialKind(material.file_type)} · {formatFileSize(material.file_size)}</small></div><span>Edit</span></summary><form onSubmit={(event) => updateMaterial(event, material.id)}><label><span>Title</span><input name="title" defaultValue={material.title} maxLength={180} required /></label><label><span>Course</span><input name="course" defaultValue={material.course} maxLength={120} required /></label><label><span>Category</span><input name="category" defaultValue={material.category ?? ""} maxLength={120} /></label><label className="admin-description"><span>Description</span><textarea name="description" defaultValue={material.description ?? ""} maxLength={2000} rows={3} /></label><label className="admin-check"><input name="isPublished" type="checkbox" defaultChecked={material.is_published} /><span>Published</span></label><div className="admin-row-actions"><button className="button button-primary" disabled={busy}>Save changes</button><button className="admin-delete" type="button" disabled={busy} onClick={() => deleteMaterial(material.id, material.title)}>Delete material</button></div></form></details>) : <div className="materials-empty"><strong>No materials uploaded</strong><p>Use the form above to add the first real resource.</p></div>}</section>
  </div>;
}
