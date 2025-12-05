// Pokémon type colors
const typeColors: Record<string, string> = {
  bug: '#A7B723',
  dark: '#75574C',
  dragon: '#7037FF',
  electric: '#F9CF30',
  fairy: '#E69EAC',
  fighting: '#C12239',
  fire: '#F57D31',
  flying: '#A891EC',
  ghost: '#70559B',
  normal: '#AAA67F',
  grass: '#74CB48',
  ground: '#DEC16B',
  ice: '#9AD6DF',
  poison: '#A43E9E',
  psychic: '#FB5584',
  rock: '#B69E31',
  steel: '#B7B9D0',
  water: '#6493EB'
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
