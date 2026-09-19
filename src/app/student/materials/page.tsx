import Link from "next/link";
import { MaterialsBrowser } from "@/components/student/materials-browser";
import { getPublishedMaterials } from "@/lib/study-materials";

export const dynamic = "force-dynamic";

export default async function StudentMaterialsPage() {
  const { materials, error } = await getPublishedMaterials();

  return <div className="materials-page">
    <header className="materials-heading"><div><p className="eyebrow"><span /> Learning resources</p><h1>Study Materials</h1><p>View and download resources published by Infosys Computer.</p></div><Link href="/student/dashboard">Back to dashboard</Link></header>
    {error ? <div className="materials-alert" role="alert"><strong>Materials are unavailable</strong><p>We could not load the published resources. Please refresh or contact the institute.</p></div> : materials.length ? <MaterialsBrowser materials={materials} /> : <div className="materials-empty"><strong>No study materials available yet</strong><p>Published course resources will appear here.</p></div>}
  </div>;
}
