import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { pokemonApi, PokemonDetail } from '../services/api'
import { getTypeColor } from '../utils/pokemonTypes'
import pokeballBg from '../assets/pokeball.svg'
import weightIcon from '../assets/weight.svg'
import straightenIcon from '../assets/straighten.svg'
import '../styles/PokemonDetailPage.css'

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return

      setIsLoading(true)
      setError('')

      const response = await pokemonApi.getById(id)

      if (response.success && response.data) {
        setPokemon(response.data)
      } else {
        setError(response.error || 'Failed to load Pokémon')
      }

      setIsLoading(false)
    }

    fetchPokemon()
  }, [id])

  const formatName = (name: string) => {
    return name.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatStatName = (name: string) => {
    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'ATK',
      'defense': 'DEF',
      'special-attack': 'SATK',
      'special-defense': 'SDEF',
      'speed': 'SPD'
    }
    return statNames[name] || name
  }

  if (isLoading) {
    return (
      <div className="detail-loading">
        <div className="pokeball-loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="detail-error">
        <p>{error || 'Pokémon not found'}</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    )
  }

  const primaryType = pokemon.types[0]
  const typeColor = getTypeColor(primaryType)

  return (
    <>
      <Helmet>
        <title>{formatName(pokemon.name)} - Pokédex</title>
        <meta name="description" content={pokemon.description} />
      </Helmet>

      <div className="detail" style={{ '--type-color': typeColor } as React.CSSProperties}>
        <div className="detail-container">
          {/* Pokeball Background */}
          <img 
            src={pokeballBg} 
            alt="" 
            className="pokeball-bg"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="detail-header">
            <div className="detail-nav">
              <Link to="/" className="back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </Link>
              <h1>{formatName(pokemon.name)}</h1>
              <span className="pokemon-id">#{String(pokemon.number).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Pokemon Image Area */}
          <div className="pokemon-image-area">
            
            {pokemon.number > 1 && (
              <Link to={`/pokemon/${pokemon.number - 1}`} className="nav-arrow prev">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </Link>
            )}
            
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="pokemon-img"
            />

            <Link to={`/pokemon/${pokemon.number + 1}`} className="nav-arrow next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          </div>

          {/* Card */}
          <div className="detail-card">
            <div className="types-row">
              {pokemon.types.map(type => (
                <span
                  key={type}
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>

            <h2 className="section-title" style={{ color: typeColor }}>About</h2>
            
            <div className="about-grid">
              <div className="about-item">
                <div className="about-value">
                  <img src={weightIcon} alt="" className="about-icon" />
                  <span>{pokemon.weight} kg</span>
                </div>
                <span className="about-label">Weight</span>
              </div>

              <div className="about-divider"></div>

              <div className="about-item">
                <div className="about-value">
                  <img src={straightenIcon} alt="" className="about-icon" />
                  <span>{pokemon.height} m</span>
                </div>
                <span className="about-label">Height</span>
              </div>

              <div className="about-divider"></div>

              <div className="about-item">
                <div className="about-value abilities-list">
                  {pokemon.abilities.slice(0, 2).map(a => (
                    <span key={a.name}>{formatName(a.name)}</span>
                  ))}
                </div>
                <span className="about-label">Moves</span>
              </div>
            </div>

            <p className="description">{pokemon.description}</p>

            <h2 className="section-title" style={{ color: typeColor }}>Base Stats</h2>
            
            <div className="stats-grid">
              <div className="stats-labels">
                {pokemon.stats.map(stat => (
                  <span key={stat.name} className="stat-label" style={{ color: typeColor }}>
                    {formatStatName(stat.name)}
                  </span>
                ))}
              </div>
              <div className="stats-separator" style={{ backgroundColor: typeColor }}></div>
              <div className="stats-values">
                {pokemon.stats.map(stat => (
                  <span key={stat.name} className="stat-value">
                    {String(stat.value).padStart(3, '0')}
                  </span>
                ))}
              </div>
              <div className="stats-bars">
                {pokemon.stats.map(stat => (
                  <div 
                    key={stat.name}
                    className="stat-bar-container"
                    style={{ backgroundColor: `${typeColor}33` }}
                  >
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${Math.min(100, (stat.value / 200) * 100)}%`,
                        backgroundColor: typeColor
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PokemonDetailPage
