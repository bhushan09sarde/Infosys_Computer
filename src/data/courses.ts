export type CourseProgramType = "mscit" | "klic" | "klic-diploma" | "financial-accounting";

export type CourseStatus = "published" | "details-pending";

export interface Course {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  programType: CourseProgramType;
  shortDescription?: string | null;
  duration?: string | null;
  featured: boolean;
  status: CourseStatus;
}

export interface KlicCategory {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
}

export const klicCategories: KlicCategory[] = [
  { id: "accounting", name: "Accounting", shortLabel: "Accounting", description: "Digital tools and skills for accounting-focused work." },
  { id: "programming", name: "Programming", shortLabel: "Programming", description: "Programming and application development pathways." },
  { id: "designing", name: "Designing", shortLabel: "Designing", description: "Creative software and digital design pathways." },
  { id: "job-readiness", name: "Job Readiness", shortLabel: "Job Readiness", description: "Workplace communication, productivity and independent-work skills." },
  { id: "management", name: "Management", shortLabel: "Management", description: "Digital skills for business, finance and marketing contexts." },
  { id: "hardware-networking", name: "Hardware & Networking", shortLabel: "Hardware & Networking", description: "Computer support, network support and digital security pathways." },
  { id: "ir4", name: "Industrial Revolution 4.0", shortLabel: "IR 4.0", description: "Learning pathways in emerging connected and intelligent technologies." },
];

export const courses: Course[] = [
  { id: "mscit", slug: "ms-cit", name: "MS-CIT", category: null, programType: "mscit", shortDescription: "A main learning program offered through Infosys Computer as an MKCL Authorized Learning Center.", duration: null, featured: true, status: "details-pending" },
  { id: "klic-tally-prime-gst", slug: "klic-tally-prime-with-gst", name: "KLiC Tally Prime with GST", category: "accounting", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-advanced-tally-pro", slug: "klic-advanced-tally-pro", name: "KLiC Advanced Tally Pro", category: "accounting", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-advanced-excel", slug: "klic-advanced-excel", name: "KLiC Advanced Excel", category: "accounting", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-c-cpp", slug: "klic-c-cpp-programming", name: "KLiC C & C++ Programming", category: "programming", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-mobile-app", slug: "klic-mobile-app-development", name: "KLiC Mobile App Development", category: "programming", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-java", slug: "klic-java", name: "KLiC Java", category: "programming", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-python", slug: "klic-python", name: "KLiC Python", category: "programming", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-photoshop", slug: "klic-photoshop", name: "KLiC Photoshop", category: "designing", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-graphic-designing", slug: "klic-graphic-designing", name: "KLiC Graphic Designing", category: "designing", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-web-designing", slug: "klic-web-designing", name: "KLiC Web Designing", category: "designing", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-dtp", slug: "klic-dtp", name: "KLiC DTP", category: "designing", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-english", slug: "klic-english", name: "KLiC English", category: "job-readiness", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-data-entry", slug: "klic-data-entry-management", name: "KLiC Data Entry & Management", category: "job-readiness", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-digital-freelancing", slug: "klic-digital-freelancing", name: "KLiC Digital Freelancing", category: "job-readiness", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-office-assistance", slug: "klic-office-assistance", name: "KLiC Office Assistance", category: "job-readiness", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-bfsi", slug: "klic-bfsi", name: "KLiC Banking, Financial Services & Insurance (BFSI)", category: "management", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-social-media-marketing", slug: "klic-social-media-marketing", name: "KLiC Social Media Marketing", category: "management", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-google-workspace", slug: "klic-google-workspace", name: "KLiC Google Workspace", category: "management", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-hardware-support", slug: "klic-hardware-support", name: "KLiC Hardware Support", category: "hardware-networking", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-network-support", slug: "klic-network-support", name: "KLiC Network Support", category: "hardware-networking", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-it-cyber-security", slug: "klic-it-security-cyber-security", name: "KLiC IT Security & Cyber Security", category: "hardware-networking", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-iot", slug: "klic-internet-of-things", name: "KLiC Internet of Things (IoT)", category: "ir4", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-ai-ml", slug: "klic-ai-ml", name: "KLiC AI - ML", category: "ir4", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-robotics", slug: "klic-robotics", name: "KLiC Robotics", category: "ir4", programType: "klic", featured: false, status: "details-pending" },
  { id: "klic-diploma", slug: "klic-diploma", name: "KLiC Diploma", category: null, programType: "klic-diploma", shortDescription: "A 360-hour program structured as three KLiC courses of 120 hours each.", duration: "6 months", featured: true, status: "published" },
  { id: "financial-accounting", slug: "financial-accounting-tally", name: "Financial Accounting / Tally", category: null, programType: "financial-accounting", shortDescription: "High-level training in basic accounting, inventory, manual accounting, Tally / TallyPrime and GST-oriented accounting.", duration: null, featured: true, status: "details-pending" },
];

export const getCoursesByCategory = (categoryId: string) => courses.filter((course) => course.category === categoryId);
export const getCourseBySlug = (slug: string) => courses.find((course) => course.slug === slug);
