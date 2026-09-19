export function materialKind(mime: string) {
  return mime === "application/pdf" ? "PDF" : mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "DOCX" : "Document";
}

export function formatFileSize(bytes: number | null) {
  if (!bytes) return "Size unavailable";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export type StudyMaterial = {
  id: string;
  title: string;
  description: string | null;
  course: string;
  category: string | null;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  uploaded_by: string | null;
};
