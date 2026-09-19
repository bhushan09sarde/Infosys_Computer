import { StudyMaterialsManager } from "@/components/admin/study-materials-manager";
import { requireAdmin } from "@/lib/study-materials";
import type { StudyMaterial } from "@/lib/study-materials-shared";

export const dynamic = "force-dynamic";

export default async function AdminStudyMaterialsPage() {
  const admin = await requireAdmin();
  if (!admin) return null;
  const { data, error } = await admin.supabase.from("study_materials").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow"><span /> Resource management</p>
          <h1>Study Materials</h1>
          <p>Manage the private student resource library.</p>
        </div>
      </header>
      {error ? (
        <div className="materials-alert" role="alert">
          <strong>Materials could not be loaded</strong>
          <p>Confirm the study-materials migration has been applied.</p>
        </div>
      ) : (
        <StudyMaterialsManager materials={(data ?? []) as StudyMaterial[]} />
      )}
    </div>
  );
}
