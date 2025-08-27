type Session = {
  name: string
  email: string
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const session = localStorage.getItem("mock-session")
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("mock-session")
}
