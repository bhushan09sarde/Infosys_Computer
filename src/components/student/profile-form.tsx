"use client";

import { useActionState } from "react";
import { updateStudentProfile, type ProfileFormState } from "@/app/student/profile/actions";

const initialState: ProfileFormState = { type: "idle", message: "" };

export function ProfileForm({ fullName, email, phone, courseInterest }: { fullName: string; email: string; phone: string; courseInterest: string }) {
  const [state, action, pending] = useActionState(updateStudentProfile, initialState);
  return <form className="account-form" action={action}><label><span>Full name</span><input name="fullName" defaultValue={fullName} maxLength={120} autoComplete="name" required /></label><label><span>Email</span><input value={email} readOnly aria-describedby="email-note" /></label><small id="email-note">Email is managed by your authenticated account and cannot be changed here.</small><label><span>Mobile number <i>Optional</i></span><input name="phone" defaultValue={phone} maxLength={30} autoComplete="tel" /></label><label><span>Course interest <i>Optional</i></span><input name="courseInterest" defaultValue={courseInterest} maxLength={160} /></label>{state.message && <p className={`account-form-notice account-form-${state.type}`} role={state.type === "error" ? "alert" : "status"}>{state.message}</p>}<button className="button button-primary" disabled={pending}>{pending ? "Saving…" : "Save profile"}</button></form>;
}
