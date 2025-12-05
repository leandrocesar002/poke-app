import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { FilterProvider } from '../contexts/FilterContext'
import HomePage from './HomePage'
import { pokemonApi } from '../services/api'

vi.mock('../services/api', () => ({
  pokemonApi: {
    getList: vi.fn(),
    getByNumber: vi.fn(),
  },
}))

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}))

const mockPokemonList = [
  { id: 1, name: 'bulbasaur', number: 1, image: 'url1', types: ['grass'] },
  { id: 2, name: 'ivysaur', number: 2, image: 'url2', types: ['grass'] },
]

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

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading state initially', () => {
    vi.mocked(pokemonApi.getList).mockImplementation(() => new Promise(() => {}))
    
    renderHomePage()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays pokemon list after loading', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('Ivysaur')).toBeInTheDocument()
    })
  })

  it('displays error message when API fails', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: false,
      error: 'Failed to load Pokémon',
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load Pokémon')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('calls fetchPokemon when clicking Try Again', async () => {
    vi.mocked(pokemonApi.getList)
      .mockResolvedValueOnce({
        success: false,
        error: 'Failed to load Pokémon',
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPokemonList,
          pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
        }
      })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Try Again'))
    
    await waitFor(() => {
      expect(pokemonApi.getList).toHaveBeenCalledTimes(2)
    })
  })

  it('displays no results message when list is empty', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: [],
        pagination: { total: 0, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument()
    })
  })

  it('uses getByNumber when searching by number', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValueOnce({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    vi.mocked(pokemonApi.getByNumber).mockResolvedValue({
      success: true,
      data: {
        results: [mockPokemonList[0]],
        pagination: { total: 1, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: '1' } })
    
    await waitFor(() => {
      expect(pokemonApi.getByNumber).toHaveBeenCalledWith('1')
    }, { timeout: 500 })
  })

  it('handles getByNumber error response', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValueOnce({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    vi.mocked(pokemonApi.getByNumber).mockResolvedValue({
      success: false,
      error: 'Not found',
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: '999' } })
    
    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('handles getByNumber success but no data', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValueOnce({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    vi.mocked(pokemonApi.getByNumber).mockResolvedValue({
      success: true,
      data: undefined as any,
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: '999' } })
    
    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('displays pagination when totalPages > 1', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 50, limit: 21, offset: 0, hasNext: true, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('does not display pagination when totalPages <= 1', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('calls setSortByNumber when sort changes', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue({
      success: true,
      data: {
        results: mockPokemonList,
        pagination: { total: 2, limit: 21, offset: 0, hasNext: false, hasPrev: false }
      }
    })
    
    renderHomePage()
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const sortButton = screen.getByAltText('Sort options').closest('button')
    fireEvent.click(sortButton!)
    
    await waitFor(() => {
      expect(screen.getByText('Number')).toBeInTheDocument()
    })
    
    const numberOption = screen.getByText('Number')
    fireEvent.click(numberOption)
    
    await waitFor(() => {
      expect(pokemonApi.getList).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'number' })
      )
    })
  })
})

