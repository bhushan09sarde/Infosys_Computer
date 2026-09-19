export function safeStudentPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/student/") || value.startsWith("//")) return "/student/dashboard";
  return value;
}

export function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "The email or password is incorrect.";
  if (normalized.includes("email not confirmed")) return "Confirm your email before signing in.";
  if (normalized.includes("user already registered") || normalized.includes("already been registered")) return "An account already exists for this email.";
  if (normalized.includes("password") && normalized.includes("weak")) return "Choose a stronger password with at least 8 characters.";
  if (normalized.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return "We could not complete that request. Please try again.";
}
