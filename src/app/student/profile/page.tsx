import Image from "next/image";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/student/profile-form";
import { ProfilePhotoPicker } from "@/components/student/profile-photo-picker";
import { getStudentProfile } from "@/lib/student";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const profile = await getStudentProfile();
  if (!profile) redirect("/login?next=/student/profile");
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Your account</p><h1>Profile</h1><p>Review and update the safe personal details connected to your student account.</p></div></header><ProfilePhotoPicker currentUrl={profile.avatarUrl} allowRemove={profile.hasCustomPhoto}/><div className="profile-layout"><aside>{profile.avatarUrl ? <Image src={profile.avatarUrl} width={90} height={90} alt="" referrerPolicy="no-referrer" /> : <strong>{profile.fullName.charAt(0).toUpperCase()}</strong>}<h2>{profile.fullName}</h2><span>Student</span><p>Your role and sign-in email are protected account fields.</p></aside><ProfileForm fullName={profile.fullName} email={profile.email} phone={profile.phone} courseInterest={profile.courseInterest} /></div></div>;
}
