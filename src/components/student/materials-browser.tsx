"use client";

import { useMemo, useState } from "react";
import { formatFileSize, materialKind, type StudyMaterial } from "@/lib/study-materials-shared";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function MaterialsBrowser({ materials, showFileTypeFilter = false }: { materials: StudyMaterial[]; showFileTypeFilter?: boolean }) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [fileType, setFileType] = useState("");
  const courses = useMemo(() => [...new Set(materials.map((item) => item.course))].sort(), [materials]);
  const categories = useMemo(() => [...new Set(materials.map((item) => item.category).filter((item): item is string => Boolean(item)))].sort(), [materials]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return materials.filter((item) => (!term || `${item.title} ${item.description ?? ""} ${item.course} ${item.category ?? ""}`.toLowerCase().includes(term)) && (!course || item.course === course) && (!category || item.category === category) && (!fileType || materialKind(item.file_type) === fileType));
  }, [materials, search, course, category, fileType]);

  return <>
    <div className="materials-filters" role="search">
      <label><span>Search materials</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, course or topic" /></label>
      <label><span>Course</span><select value={course} onChange={(event) => setCourse(event.target.value)}><option value="">All courses</option>{courses.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
      {showFileTypeFilter && <label><span>File type</span><select value={fileType} onChange={(event) => setFileType(event.target.value)}><option value="">All file types</option><option value="PDF">PDF</option><option value="DOCX">DOCX</option></select></label>}
    </div>
    {filtered.length ? <div className="materials-list">{filtered.map((material) => {
      const isPdf = material.file_type === "application/pdf";
      return <article className="material-card" key={material.id}>
        <div className="material-type" aria-hidden="true">{materialKind(material.file_type)}</div>
        <div className="material-copy"><div className="material-meta"><span>{material.course}</span>{material.category && <span>{material.category}</span>}</div><h2>{material.title}</h2>{material.description && <p>{material.description}</p>}<small>{material.file_name} · {formatFileSize(material.file_size)} · Published {dateLabel(material.created_at)}</small></div>
        <div className="material-actions">{isPdf && <a href={`/student/materials/${material.id}/file`} target="_blank" rel="noreferrer">View PDF</a>}<a className="material-download" href={`/student/materials/${material.id}/file?download=1`}>Download</a></div>
      </article>;
    })}</div> : <div className="materials-empty"><strong>No matching materials</strong><p>Try clearing one or more filters.</p></div>}
  </>;
}
