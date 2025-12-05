import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../../contexts/AuthContext'
import { FilterProvider } from '../../contexts/FilterContext'
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
  getAuthToken: vi.fn(() => 'test-token'),
}))

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      user: { username: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  }
})

const renderHomePage = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <FilterProvider>
          <HomePage />
        </FilterProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

const mockPokemonList = [
  { id: 1, name: 'bulbasaur', number: 1, image: 'url1', types: ['grass'] },
  { id: 4, name: 'charmander', number: 4, image: 'url4', types: ['fire'] },
  { id: 7, name: 'squirtle', number: 7, image: 'url7', types: ['water'] },
  { id: 25, name: 'pikachu', number: 25, image: 'url25', types: ['electric'] },
]

describe('Pokemon Search Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays pokemon list on initial load', async () => {
    const { pokemonApi } = await import('../../services/api')
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 4, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('Charmander')).toBeInTheDocument()
      expect(screen.getByText('Squirtle')).toBeInTheDocument()
      expect(screen.getByText('Pikachu')).toBeInTheDocument()
    })
  })

  it('filters pokemon by name when searching', async () => {
    const { pokemonApi } = await import('../../services/api')
    
    vi.mocked(pokemonApi.getList)
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPokemonList,
          pagination: { total: 4, limit: 21, offset: 0, hasNext: false, hasPrev: false }
        }
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: [mockPokemonList[1]],
          pagination: { total: 1, limit: 21, offset: 0, hasNext: false, hasPrev: false }
        }
      })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'char' } })
    
    await waitFor(() => {
      expect(pokemonApi.getList).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'char' })
      )
    }, { timeout: 500 })
  })

  it('searches by number when numeric input', async () => {
    const { pokemonApi } = await import('../../services/api')
    
    vi.mocked(pokemonApi.getList).mockResolvedValueOnce({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 4, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    vi.mocked(pokemonApi.getByNumber).mockResolvedValueOnce({
      success: true,
      data: {
        results: [mockPokemonList[3]],
        pagination: { total: 1, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: '25' } })
    
    await waitFor(() => {
      expect(pokemonApi.getByNumber).toHaveBeenCalledWith('25')
    }, { timeout: 500 })
  })

  it('shows no results message when search returns empty', async () => {
    const { pokemonApi } = await import('../../services/api')
    
    vi.mocked(pokemonApi.getList)
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPokemonList,
          pagination: { total: 4, limit: 21, offset: 0, hasNext: false, hasPrev: false }
        }
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: [],
          pagination: { total: 0, limit: 21, offset: 0, hasNext: false, hasPrev: false }
        }
      })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('clears search when clicking clear button', async () => {
    const { pokemonApi } = await import('../../services/api')
    
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 4, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByLabelText('Clear search'))
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })
})

