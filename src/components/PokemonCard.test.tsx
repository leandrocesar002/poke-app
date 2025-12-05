import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PokemonCard from './PokemonCard'
import { Pokemon } from '../services/api'

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  number: 25,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  types: ['electric']
}

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('PokemonCard', () => {
  it('renders pokemon name correctly', () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('renders pokemon number with leading zeros', () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('renders pokemon image with correct alt text', () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />)
    const image = screen.getByAltText('pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPokemon.image)
  })

  it('links to correct pokemon detail page', () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pokemon/25')
  })

  it('capitalizes pokemon name', () => {
    const lowercasePokemon = { ...mockPokemon, name: 'bulbasaur' }
    renderWithRouter(<PokemonCard pokemon={lowercasePokemon} />)
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
  })

  it('formats single digit number with padding', () => {
    const singleDigitPokemon = { ...mockPokemon, number: 1 }
    renderWithRouter(<PokemonCard pokemon={singleDigitPokemon} />)
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('formats triple digit number correctly', () => {
    const tripleDigitPokemon = { ...mockPokemon, number: 150 }
    renderWithRouter(<PokemonCard pokemon={tripleDigitPokemon} />)
    expect(screen.getByText('#150')).toBeInTheDocument()
  })
})

