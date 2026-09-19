"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 5 * 1024 * 1024;

export function validateProfilePhoto(file: File) {
  if (!allowed.has(file.type)) return "Use a JPEG, PNG, or WebP image.";
  if (file.size > maxBytes) return "The profile photo must be 5 MB or smaller.";
  return null;
}

export function ProfilePhotoPicker({ currentUrl = null, onSelected, allowRemove = false }: { currentUrl?: string | null; onSelected?: (file: File | null) => void; allowRemove?: boolean }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function select(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;
    const error = validateProfilePhoto(selected);
    if (error) { setNotice({ type: "error", message: error }); event.target.value = ""; return; }
    setNotice(null); setFile(selected); setPreview(URL.createObjectURL(selected)); onSelected?.(selected);
  }

  async function upload() {
    if (!file) return;
    setBusy(true); setNotice(null);
    try {
      const form = new FormData(); form.set("photo", file);
      const response = await fetch("/api/student/profile-photo", { method: "POST", body: form });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "The photo could not be uploaded.");
      setFile(null); setPreview(null); onSelected?.(null); setNotice({ type: "success", message: "Profile photo updated." }); router.refresh();
    } catch (error) { setNotice({ type: "error", message: error instanceof Error ? error.message : "The photo could not be uploaded." }); }
    finally { setBusy(false); }
  }

  async function remove() {
    setBusy(true); setNotice(null);
    try { const response = await fetch("/api/student/profile-photo", { method: "DELETE" }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "The photo could not be removed."); setFile(null); setPreview(null); setNotice({ type: "success", message: "Custom profile photo removed." }); router.refresh(); }
    catch (error) { setNotice({ type: "error", message: error instanceof Error ? error.message : "The photo could not be removed." }); }
    finally { setBusy(false); }
  }

  return <section className="profile-photo-control" aria-labelledby="profile-photo-title"><div className="profile-photo-preview">{preview || currentUrl ? <Image src={preview || currentUrl!} alt="Profile photo preview" width={96} height={96} unoptimized={Boolean(preview)} /> : <span aria-hidden="true">Photo</span>}</div><div className="profile-photo-copy"><h3 id="profile-photo-title">Profile Photo <small>Optional</small></h3><p>JPEG, PNG, or WebP · maximum 5 MB.</p><div className="profile-photo-actions"><button type="button" onClick={() => gallery.current?.click()} disabled={busy}>Choose Photo</button><button type="button" onClick={() => camera.current?.click()} disabled={busy}>Use Camera</button>{allowRemove && currentUrl && <button className="profile-photo-remove" type="button" onClick={remove} disabled={busy}>Remove</button>}</div><input ref={gallery} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={select}/><input ref={camera} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={select}/>{allowRemove && file && <button className="button button-primary button-small profile-photo-save" type="button" onClick={upload} disabled={busy}>{busy ? "Uploading…" : "Save Photo"}</button>}{notice && <p className={`account-form-notice account-form-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p>}</div></section>;
}
