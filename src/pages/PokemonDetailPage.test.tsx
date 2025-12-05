import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PokemonDetailPage from './PokemonDetailPage'
import { pokemonApi, PokemonDetail } from '../services/api'

vi.mock('../services/api', () => ({
  pokemonApi: {
    getById: vi.fn(),
  },
}))

const mockPokemonDetail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  number: 25,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  types: ['electric'],
  images: {
    front: 'front.png',
    back: 'back.png',
    frontShiny: 'front-shiny.png',
    backShiny: 'back-shiny.png',
    artwork: 'artwork.png',
  },
  height: 0.4,
  weight: 6.0,
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  moves: [
    { name: 'thunderbolt', learnMethod: 'level-up' },
    { name: 'quick-attack', learnMethod: 'level-up' },
    { name: 'iron-tail', learnMethod: 'tm' },
  ],
  stats: [
    { name: 'hp', value: 35 },
    { name: 'attack', value: 55 },
    { name: 'defense', value: 40 },
    { name: 'special-attack', value: 50 },
    { name: 'special-defense', value: 50 },
    { name: 'speed', value: 90 },
  ],
  forms: [
    { name: 'pikachu', isDefault: true },
    { name: 'pikachu-cosplay', isDefault: false },
  ],
  description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
  genus: 'Mouse Pokémon',
  habitat: 'forest',
  generation: 'generation-i',
}

const renderDetailPage = (id = '25') => {
  window.history.pushState({}, '', `/pokemon/${id}`)
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

describe('PokemonDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, '', '/pokemon/25')
  })

  it('renders loading state initially', () => {
    vi.mocked(pokemonApi.getById).mockImplementation(() => new Promise(() => {}))
    
    renderDetailPage()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays pokemon details after loading', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent('Pikachu')
    })
    
    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByAltText('pikachu')).toBeInTheDocument()
  })

  it('displays pokemon types', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText('Electric')).toBeInTheDocument()
    })
  })

  it('displays about section with weight and height', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    const { container } = renderDetailPage()
    
    await waitFor(() => {
      const weightLabel = screen.getAllByText('Weight').find(el => el.className === 'about-label')
      const heightLabel = screen.getAllByText('Height').find(el => el.className === 'about-label')
      expect(weightLabel).toBeInTheDocument()
      expect(heightLabel).toBeInTheDocument()
    })
    
    const aboutValues = container.querySelectorAll('.about-value')
    const weightText = aboutValues[0]?.textContent || ''
    const heightText = aboutValues[1]?.textContent || ''
    
    expect(weightText).toContain('6')
    expect(weightText).toContain('kg')
    expect(heightText).toContain('0.4')
    expect(heightText).toContain('m')
  })

  it('displays base stats', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText('Base Stats')).toBeInTheDocument()
      expect(screen.getByText('HP')).toBeInTheDocument()
      expect(screen.getByText('ATK')).toBeInTheDocument()
      expect(screen.getByText('035')).toBeInTheDocument()
      expect(screen.getByText('055')).toBeInTheDocument()
    })
  })

  it('displays moves section', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      const movesTitle = screen.getAllByText('Moves').find(el => el.tagName === 'H2')
      expect(movesTitle).toBeInTheDocument()
      expect(screen.getByText('Thunderbolt')).toBeInTheDocument()
      expect(screen.getByText('Quick Attack')).toBeInTheDocument()
    })
  })

  it('displays forms section when multiple forms exist', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText('Forms')).toBeInTheDocument()
      const formBadges = screen.getAllByText('Pikachu').filter(el => el.className.includes('form-badge'))
      expect(formBadges.length).toBeGreaterThan(0)
      expect(screen.getByText('Pikachu Cosplay')).toBeInTheDocument()
    })
  })

  it('does not display forms section when only one form exists', async () => {
    const singleFormPokemon = {
      ...mockPokemonDetail,
      forms: [{ name: 'pikachu', isDefault: true }],
    }
    
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: singleFormPokemon,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.queryByText('Forms')).not.toBeInTheDocument()
    })
  })

  it('displays error message when pokemon not found', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: false,
      error: 'Pokémon not found',
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument()
    })
    
    const goBackButton = screen.getByText('Go Back')
    expect(goBackButton).toBeInTheDocument()
    expect(goBackButton.closest('button')).toBeInTheDocument()
  })

  it('displays description', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText(mockPokemonDetail.description)).toBeInTheDocument()
    })
  })

  it('shows navigation arrows for pokemon number > 1', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      const arrows = screen.getAllByRole('link')
      const prevArrow = arrows.find(link => link.getAttribute('href') === '/pokemon/24')
      expect(prevArrow).toBeInTheDocument()
    })
  })

  it('formats stat names correctly', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue({
      success: true,
      data: mockPokemonDetail,
    })
    
    renderDetailPage()
    
    await waitFor(() => {
      expect(screen.getByText('SATK')).toBeInTheDocument()
      expect(screen.getByText('SDEF')).toBeInTheDocument()
      expect(screen.getByText('SPD')).toBeInTheDocument()
    })
  })
})

