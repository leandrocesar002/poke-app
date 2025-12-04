import { Link } from 'react-router-dom'
import { Pokemon } from '../services/api'
import '../styles/PokemonCard.css'

interface PokemonCardProps {
  pokemon: Pokemon
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card">
      <span className="card-number">#{String(pokemon.number).padStart(3, '0')}</span>
      
      <div className="card-image">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy"
        />
      </div>

      <h3 className="card-name">{formatName(pokemon.name)}</h3>
    </Link>
  )
}

export default PokemonCard

