export const routes = {
  public: ["/", "/about", "/courses", "/study-materials", "/gallery", "/events", "/contact", "/login", "/register"],
  student: ["/student/dashboard", "/student/courses", "/student/materials", "/student/announcements", "/student/events", "/student/downloads", "/student/profile", "/student/change-password", "/student/support"],
  admin: ["/admin/dashboard", "/admin/students", "/admin/enrollments", "/admin/study-materials", "/admin/announcements", "/admin/events", "/admin/profile"],
} as const;
