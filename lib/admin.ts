export const ADMIN_USERNAME = "admin@cuilahore.edu.pk"
export const ADMIN_PASSWORD = "admin123"

const ADMIN_KEY = "__ite_admin_session__"

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(ADMIN_KEY) === "1"
}

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_KEY, "1")
    }
    return true
  }
  return false
}

export function adminLogout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_KEY)
  }
}
