"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { createBrowserClient } from "@supabase/ssr"

// Using a simplified user type for the context
export interface User {
  id: string
  email?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, name: string) => Promise<any>
  logout: () => Promise<void>
  loginWithGoogle: (nextPath?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Create Supabase browser client
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      // In dev, surface a clear message in console; app still functions without auth
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY")
      }
    }
    return createBrowserClient(url || "", anon || "")
  }, [])

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data.session?.user) {
        setUser({ id: data.session.user.id, email: data.session.user.email || undefined })
      }
      setIsLoading(false)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user
      setUser(currentUser ? { id: currentUser.id, email: currentUser.email || undefined } : null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (error) throw error
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Ensure the error message from the API is thrown
        throw new Error(data.error || "An unknown registration error occurred.");
      }

      // On successful registration, Supabase sends a verification email.
      // The user should not be logged in until they verify.
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setIsLoading(false)
  }

  const loginWithGoogle = async (nextPath: string = '/') => {
    setIsLoading(true)
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
      const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
                // Show account chooser without pre-filling domain hints
                prompt: 'select_account',
          },
        },
      } as any)
      if (error) throw error
    } finally {
      // Do not clear loading here; OAuth redirects away. If it fails early, finally still runs.
      setIsLoading(false)
    }
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithGoogle,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
