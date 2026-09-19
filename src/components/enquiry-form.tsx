"use client";

import { useState } from "react";

export function EnquiryForm({ courseOptions }: { courseOptions: { value: string; label: string }[] }) {
  const [message, setMessage] = useState("");

  return <form className="enquiry-form" onSubmit={(event) => { event.preventDefault(); setMessage("Online enquiry submission will be available soon. Please visit the institute for course-related information."); }}>
    <div className="form-row"><div className="form-field"><label htmlFor="full-name">Full Name</label><input id="full-name" name="fullName" autoComplete="name" required /></div><div className="form-field"><label htmlFor="mobile-number">Mobile Number</label><input id="mobile-number" name="mobileNumber" type="tel" inputMode="tel" autoComplete="tel" required /></div></div>
    <div className="form-row"><div className="form-field"><label htmlFor="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" /></div><div className="form-field"><label htmlFor="course-interest">Course Interest</label><select id="course-interest" name="courseInterest" defaultValue=""><option value="" disabled>Select a course or program</option>{courseOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div></div>
    <div className="form-field"><label htmlFor="enquiry-message">Message</label><textarea id="enquiry-message" name="message" rows={5} /></div>
    <div className="form-submit"><button className="button button-primary" type="submit">Send Enquiry <span aria-hidden="true">→</span></button><p>Enquiry storage is not active yet.</p></div>
    <p className="form-status" aria-live="polite">{message}</p>
  </form>;
}
