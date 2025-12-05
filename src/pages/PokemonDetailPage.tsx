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
  const [isMovesModalOpen, setIsMovesModalOpen] = useState(false)
  const [formIds, setFormIds] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return

      setIsLoading(true)
      setError('')

      const response = await pokemonApi.getById(id)

      if (response.success && response.data) {
        setPokemon(response.data)
        
        // Fetch IDs for all forms
        if (response.data.forms && response.data.forms.length > 1) {
          const ids: Record<string, number> = {}
          
          // Add current pokemon ID
          ids[response.data.name.toLowerCase()] = response.data.id
          
          // Fetch IDs for other forms
          const formPromises = response.data.forms
            .filter(form => form.name.toLowerCase() !== response.data.name.toLowerCase())
            .map(async (form) => {
              try {
                const formResponse = await pokemonApi.getList({ 
                  search: form.name.toLowerCase(),
                  limit: 1 
                })
                if (formResponse.success && formResponse.data?.results.length > 0) {
                  const foundPokemon = formResponse.data.results.find(
                    p => p.name.toLowerCase() === form.name.toLowerCase()
                  )
                  if (foundPokemon) {
                    ids[form.name.toLowerCase()] = foundPokemon.id
                  }
                }
              } catch (err) {
                // Silently fail for individual form lookups
              }
            })
          
          await Promise.all(formPromises)
          setFormIds(ids)
        }
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
        <button onClick={() => navigate('/pokemon/list')}>Go Back</button>
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
              <Link to="/pokemon/list" className="back-btn">
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

            {pokemon.moves && pokemon.moves.length > 0 && (
              <>
                <h2 className="section-title" style={{ color: typeColor }}>Moves</h2>
                <div className="moves-list">
                  {pokemon.moves.slice(0, 10).map(move => (
                    <span key={move.name} className="move-badge">
                      {formatName(move.name)}
                    </span>
                  ))}
                  {pokemon.moves.length > 10 && (
                    <button 
                      className="more-moves" 
                      onClick={() => setIsMovesModalOpen(true)}
                    >
                      +{pokemon.moves.length - 10} more
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Moves Modal */}
            {isMovesModalOpen && (
              <div className="modal-overlay" onClick={() => setIsMovesModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2 style={{ color: typeColor }}>All Moves</h2>
                    <button 
                      className="modal-close" 
                      onClick={() => setIsMovesModalOpen(false)}
                      aria-label="Close modal"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="moves-list-modal">
                      {pokemon.moves.map(move => (
                        <span key={move.name} className="move-badge">
                          {formatName(move.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pokemon.forms && pokemon.forms.length > 1 && (
              <>
                <h2 className="section-title" style={{ color: typeColor }}>Forms</h2>
                <div className="forms-list">
                  {pokemon.forms.map(form => {
                    const formNameLower = form.name.toLowerCase()
                    const currentPokemonName = pokemon.name.toLowerCase()
                    const isCurrentForm = formNameLower === currentPokemonName
                    const formId = formIds[formNameLower] || pokemon.id
                    
                    return isCurrentForm ? (
                      <span 
                        key={form.name} 
                        className={`form-badge ${form.isDefault ? 'default' : ''} current`}
                      >
                        {formatName(form.name)}
                        {form.isDefault && <span className="default-tag">Default</span>}
                      </span>
                    ) : (
                      <Link
                        key={form.name}
                        to={`/pokemon/${formId}`}
                        className={`form-badge ${form.isDefault ? 'default' : ''}`}
                      >
                        {formatName(form.name)}
                        {form.isDefault && <span className="default-tag">Default</span>}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PokemonDetailPage
