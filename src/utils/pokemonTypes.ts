// Pokémon type colors
const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

export function getTypeColor(type: string): string {
  return typeColors[type.toLowerCase()] || '#777777'
}

export function getTypeGradient(types: string[]): string {
  if (types.length === 1) {
    const color = getTypeColor(types[0])
    return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
  }
  return `linear-gradient(135deg, ${getTypeColor(types[0])} 0%, ${getTypeColor(types[1])} 100%)`
}

