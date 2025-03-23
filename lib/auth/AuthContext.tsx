"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Function to set auth cookie
  const setAuthState = useCallback((userData: User | null, remember = false) => {
    if (userData) {
      // Set user in state
      setUser(userData)

      // Store in localStorage/sessionStorage
      try {
        if (remember) {
          localStorage.setItem("user", JSON.stringify(userData))
          sessionStorage.removeItem("user")
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData))
          localStorage.removeItem("user")
        }

        // Set cookie
        const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60
        document.cookie = `auth-token=authenticated; path=/; max-age=${maxAge}`
      } catch (error) {
        console.error("Error storing auth data:", error)
      }
    } else {
      // Clear user state
      setUser(null)

      // Clear storage
      try {
        localStorage.removeItem("user")
        sessionStorage.removeItem("user")
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      } catch (error) {
        console.error("Error clearing auth data:", error)
      }
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      try {
        // Check localStorage/sessionStorage
        const localStorageUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
        const sessionStorageUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null
        const storedUser = localStorageUser || sessionStorageUser

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setAuthState(userData, !!localStorageUser)
        } else {
          setAuthState(null)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setAuthState(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [setAuthState])

  // Login function
  const login = async (email: string, password: string, remember = false): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock user data
      const userData: User = {
        id: "1",
        name: "Demo User",
        email: email,
        role: "admin",
      }

      setAuthState(userData, remember)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setAuthState(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

