import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../../contexts/AuthContext'
import { FilterProvider } from '../../contexts/FilterContext'
import App from '../../App'
import LoginPage from '../../pages/LoginPage'
import HomePage from '../../pages/HomePage'

vi.mock('../../services/api', () => ({
  authApi: {
    login: vi.fn(),
    verify: vi.fn(),
    logout: vi.fn(),
  },
  pokemonApi: {
    getList: vi.fn(),
    getByNumber: vi.fn(),
    getById: vi.fn(),
  },
  getAuthToken: vi.fn(() => null),
}))

const renderApp = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('redirects unauthenticated users to login', async () => {
    const { authApi } = await import('../../services/api')
    vi.mocked(authApi.verify).mockResolvedValue({ success: false })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })
  })

  it('shows home page after successful login', async () => {
    const { authApi, pokemonApi } = await import('../../services/api')
    
    vi.mocked(authApi.verify).mockResolvedValue({ success: false })
    vi.mocked(authApi.login).mockResolvedValue({
      success: true,
      data: {
        token: 'test-token',
        user: { username: 'admin' }
      }
    })
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: [
          { id: 1, name: 'bulbasaur', number: 1, image: 'url', types: ['grass'] },
        ],
        pagination: { total: 1, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Pokédex')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows error message for invalid credentials', async () => {
    const { authApi } = await import('../../services/api')
    
    vi.mocked(authApi.verify).mockResolvedValue({ success: false })
    vi.mocked(authApi.login).mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wrong' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('persists authentication across page reload', async () => {
    const { authApi, pokemonApi } = await import('../../services/api')
    
    localStorage.setItem('pokemon_auth_token', 'saved-token')
    localStorage.setItem('pokemon_user', JSON.stringify({ username: 'admin' }))
    
    vi.mocked(authApi.verify).mockResolvedValue({ success: true })
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: [],
        pagination: { total: 0, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText('Pokédex')).toBeInTheDocument()
    })
  })
})

