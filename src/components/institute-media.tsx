import fs from "node:fs";
import path from "node:path";
import { InstituteVideo } from "@/components/institute-video";

type InstituteMediaProps = {
  mode?: "feature" | "player" | "photo";
  label?: string;
};

export function InstituteMedia({ mode = "feature", label = "Inside Infosys Computer" }: InstituteMediaProps) {
  const videoExists = fs.existsSync(path.join(process.cwd(), "public", "videos", "institute-tour.mp4"));

  if (videoExists && mode !== "photo") {
    return <div className={`institute-media institute-media-${mode}`}><InstituteVideo mode={mode} /><div className="institute-media-label"><span>{label}</span><strong>Infosys Computer · Nagpur</strong></div></div>;
  }

  return <div className={`institute-media institute-media-${mode} media-placeholder`} role="img" aria-label="Institute media placeholder"><div className="media-grid" aria-hidden="true" /><div className="media-placeholder-copy"><span>{label}</span><strong>Real institute media<br />will appear here.</strong><p>Infosys Computer · Nagpur</p></div></div>;
}
