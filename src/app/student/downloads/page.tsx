import { MaterialsBrowser } from "@/components/student/materials-browser";
import { getPublishedMaterials } from "@/lib/study-materials";

export const dynamic = "force-dynamic";

export default async function StudentDownloadsPage() {
  const { materials, error } = await getPublishedMaterials();
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Secure resources</p><h1>Downloads</h1><p>Published documents available through the private Study Materials library.</p></div></header>{error ? <div className="materials-alert" role="alert"><strong>Downloads are unavailable</strong><p>We could not load the published resources.</p></div> : materials.length ? <MaterialsBrowser materials={materials} showFileTypeFilter /> : <div className="portal-complete-empty"><strong>No downloads available yet.</strong><p>Published PDF and DOCX resources will appear here.</p></div>}</div>;
}
