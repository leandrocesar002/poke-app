import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import LoginPage from './LoginPage'
import { AuthProvider } from '../contexts/AuthContext'

vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    verify: vi.fn(),
    logout: vi.fn(),
  },
  getAuthToken: vi.fn(() => null),
}))

const renderLoginPage = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    renderLoginPage()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders Pokédex branding', () => {
    renderLoginPage()
    expect(screen.getAllByText('Pokédex').length).toBeGreaterThan(0)
  })

  it('shows demo credentials hint', () => {
    renderLoginPage()
    expect(screen.getByText(/admin \/ admin/)).toBeInTheDocument()
  })

  it('shows validation error for short username', async () => {
    renderLoginPage()
    const usernameInput = screen.getByLabelText('Username')
    
    fireEvent.change(usernameInput, { target: { value: 'ab' } })
    fireEvent.blur(usernameInput)
    
    await waitFor(() => {
      expect(screen.getByText('Min 3 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error for empty username', async () => {
    renderLoginPage()
    const usernameInput = screen.getByLabelText('Username')
    
    fireEvent.focus(usernameInput)
    fireEvent.blur(usernameInput)
    
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    renderLoginPage()
    const passwordInput = screen.getByLabelText('Password')
    
    fireEvent.change(passwordInput, { target: { value: 'abc' } })
    fireEvent.blur(passwordInput)
    
    await waitFor(() => {
      expect(screen.getByText('Min 4 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error for empty password', async () => {
    renderLoginPage()
    const passwordInput = screen.getByLabelText('Password')
    
    fireEvent.focus(passwordInput)
    fireEvent.blur(passwordInput)
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('disables inputs while loading', async () => {
    const { authApi } = await import('../services/api')
    vi.mocked(authApi.login).mockImplementation(() => new Promise(() => {}))
    
    renderLoginPage()
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(usernameInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
    })
  })

  it('enables submit button with valid credentials', () => {
    renderLoginPage()
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin' } })
    
    expect(submitButton).not.toBeDisabled()
  })
})

