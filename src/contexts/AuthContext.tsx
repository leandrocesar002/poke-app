import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'

interface User {
  username: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'pokemon_auth_token'
const USER_KEY = 'pokemon_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)

      if (token && savedUser) {
        try {
          const response = await authApi.verify(token)
          if (response.success) {
            setUser(JSON.parse(savedUser))
          } else {
            // Token invalid, clear storage
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)

      if (response.success && response.data) {
        const { token, user: userData } = response.data
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      }

      return { success: false, error: response.error || 'Login failed' }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

