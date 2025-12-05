import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { useFilter } from '../contexts/FilterContext'
import { pokemonApi, Pokemon } from '../services/api'
import PokemonCard from '../components/PokemonCard'
import Pagination from '../components/Pagination'
import Header from '../components/Header'
import '../styles/HomePage.css'

function HomePage() {
  const { logout } = useAuth()
  const { sortByNumber, setSortByNumber, search, setSearch } = useFilter()
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 21

  // Detecta se o search é número(s) ou texto
  const isNumericSearch = (value: string) => {
    const terms = value.trim().split(/\s+/)
    return terms.every(term => /^\d+$/.test(term))
  }

  // Converte espaços em vírgulas para múltipla busca
  const formatSearchQuery = (value: string) => {
    return value.trim().split(/\s+/).join(',')
  }

  // Determina se deve buscar por número
  const shouldSearchByNumber = (): boolean => {
    if (sortByNumber === true) return true
    if (sortByNumber === false) return false
    // Auto-detect: se não tiver filtro selecionado
    return search ? isNumericSearch(search) : false
  }

  const fetchPokemon = useCallback(async () => {
    setIsLoading(true)
    setError('')

    const searchByNumber = shouldSearchByNumber()
    const formattedSearch = search ? formatSearchQuery(search) : ''

    // Se tiver search e for busca por número, usa o endpoint específico
    if (formattedSearch && searchByNumber) {
      const response = await pokemonApi.getByNumber(formattedSearch)
      
      if (response.success && response.data) {
        setPokemon(response.data.results)
        setTotalPages(Math.ceil(response.data.pagination.total / ITEMS_PER_PAGE))
      } else {
        setPokemon([])
        setTotalPages(1)
      }
    } else {
      // Busca normal (por nome ou listagem)
      const offset = (currentPage - 1) * ITEMS_PER_PAGE

      const response = await pokemonApi.getList({
        limit: ITEMS_PER_PAGE,
        offset,
        search: formattedSearch || undefined,
        sortBy: searchByNumber ? 'number' : 'name',
        sortOrder: 'asc'
      })

      if (response.success && response.data) {
        setPokemon(response.data.results)
        setTotalPages(Math.ceil(response.data.pagination.total / ITEMS_PER_PAGE))
      } else {
        setError(response.error || 'Failed to load Pokémon')
      }
    }

    setIsLoading(false)
  }, [currentPage, search, sortByNumber])

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortByNumber])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleSortChange = (byNumber: boolean) => {
    setSortByNumber(byNumber)
  }

  return (
    <>
      <Helmet>
        <title>Pokédex</title>
        <meta name="description" content="Browse and search through hundreds of Pokémon." />
      </Helmet>

      <div className="home-page">
        <Header 
          onLogout={logout}
          searchValue={search}
          onSearchChange={handleSearch}
          sortByNumber={sortByNumber}
          onToggleSort={handleSortChange}
        />

        <main className="main-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchPokemon}>Try Again</button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <div className="pokeball-loader"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {pokemon.length === 0 ? (
                <div className="no-results">
                  <p>No Pokémon found</p>
                </div>
              ) : (
                <div className="pokemon-grid">
                  {pokemon.map((p) => (
                    <PokemonCard key={p.id} pokemon={p} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default HomePage

