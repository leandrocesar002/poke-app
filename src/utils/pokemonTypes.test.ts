import { describe, it, expect } from 'vitest'
import { getTypeColor, getTypeGradient } from './pokemonTypes'

describe('pokemonTypes', () => {
  describe('getTypeColor', () => {
    it('returns correct color for bug type', () => {
      expect(getTypeColor('bug')).toBe('#A7B723')
    })

    it('returns correct color for fire type', () => {
      expect(getTypeColor('fire')).toBe('#F57D31')
    })

    it('returns correct color for water type', () => {
      expect(getTypeColor('water')).toBe('#6493EB')
    })

    it('handles uppercase type names', () => {
      expect(getTypeColor('FIRE')).toBe('#F57D31')
    })

    it('handles mixed case type names', () => {
      expect(getTypeColor('ElEcTrIc')).toBe('#F9CF30')
    })

    it('returns default color for unknown type', () => {
      expect(getTypeColor('unknown')).toBe('#777777')
    })

    it('returns default color for empty string', () => {
      expect(getTypeColor('')).toBe('#777777')
    })
  })

  describe('getTypeGradient', () => {
    it('returns single color gradient for one type', () => {
      const gradient = getTypeGradient(['fire'])
      expect(gradient).toContain('#F57D31')
      expect(gradient).toContain('linear-gradient')
    })

    it('returns dual color gradient for two types', () => {
      const gradient = getTypeGradient(['fire', 'water'])
      expect(gradient).toContain('#F57D31')
      expect(gradient).toContain('#6493EB')
      expect(gradient).toContain('linear-gradient')
    })

    it('handles uppercase type names', () => {
      const gradient = getTypeGradient(['FIRE', 'WATER'])
      expect(gradient).toContain('#F57D31')
      expect(gradient).toContain('#6493EB')
    })
  })
})

