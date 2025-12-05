import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { authApi } from '../services/api'

vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    verify: vi.fn(),
    logout: vi.fn(),
  },
}))

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()
  
  return (
    <div>
      <span data-testid="loading">{isLoading.toString()}</span>
      <span data-testid="authenticated">{isAuthenticated.toString()}</span>
      <span data-testid="username">{user?.username || 'none'}</span>
      <button onClick={() => login('admin', 'admin')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(authApi.verify).mockResolvedValue({ success: false })
  })

  it('provides initial unauthenticated state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(screen.getByTestId('username').textContent).toBe('none')
  })

  it('authenticates user on successful login', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      success: true,
      data: {
        token: 'test-token',
        user: { username: 'admin' }
      }
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
      expect(screen.getByTestId('username').textContent).toBe('admin')
    })
  })

  it('handles login failure', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
    })
  })

  it('clears user on logout', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      success: true,
      data: {
        token: 'test-token',
        user: { username: 'admin' }
      }
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Logout'))
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
      expect(screen.getByTestId('username').textContent).toBe('none')
    })
  })

  it('restores session from localStorage', async () => {
    localStorage.setItem('pokemon_auth_token', 'saved-token')
    localStorage.setItem('pokemon_user', JSON.stringify({ username: 'saveduser' }))
    
    vi.mocked(authApi.verify).mockResolvedValue({ success: true })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('username').textContent).toBe('saveduser')
  })

  it('handles network error during login', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Network error'))
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
    })
  })

  it('clears storage when token verification fails', async () => {
    localStorage.setItem('pokemon_auth_token', 'invalid-token')
    localStorage.setItem('pokemon_user', JSON.stringify({ username: 'test' }))
    
    vi.mocked(authApi.verify).mockResolvedValue({ success: false })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(localStorage.getItem('pokemon_auth_token')).toBeNull()
      expect(localStorage.getItem('pokemon_user')).toBeNull()
    })
  })

  it('clears storage when token verification throws error', async () => {
    localStorage.setItem('pokemon_auth_token', 'invalid-token')
    localStorage.setItem('pokemon_user', JSON.stringify({ username: 'test' }))
    
    vi.mocked(authApi.verify).mockRejectedValue(new Error('Network error'))
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(localStorage.getItem('pokemon_auth_token')).toBeNull()
      expect(localStorage.getItem('pokemon_user')).toBeNull()
    })
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleError.mockRestore()
  })
})

describe('getAuthToken', () => {
  it('returns token from localStorage', async () => {
    localStorage.setItem('pokemon_auth_token', 'test-token')
    const { getAuthToken } = await import('./AuthContext')
    expect(getAuthToken()).toBe('test-token')
  })

  it('returns null when no token in localStorage', async () => {
    localStorage.removeItem('pokemon_auth_token')
    const { getAuthToken } = await import('./AuthContext')
    expect(getAuthToken()).toBeNull()
  })
})

