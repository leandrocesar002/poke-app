import axios from 'axios'
import { getAuthToken } from '../contexts/AuthContext'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export interface Pokemon {
  id: number
  name: string
  number: number
  image: string
  types: string[]
}

export interface PokemonDetail extends Pokemon {
  images: {
    front: string
    back: string
    frontShiny: string
    backShiny: string
    artwork: string
  }
  height: number
  weight: number
  abilities: { name: string; isHidden: boolean }[]
  moves: { name: string; learnMethod: string }[]
  stats: { name: string; value: number }[]
  forms: { name: string; isDefault: boolean }[]
  description: string
  genus: string
  habitat: string
  generation: string
}

export interface PaginatedResponse<T> {
  results: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<ApiResponse<{ token: string; user: { username: string } }>> => {
    try {
      const response = await api.post('/auth/login', { username, password })
      return response.data
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  },

  verify: async (token: string): Promise<ApiResponse<{ user: { username: string } }>> => {
    try {
      const response = await api.post('/auth/verify', { token })
      return response.data
    } catch {
      return { success: false, error: 'Token verification failed' }
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch {
      return { success: true }
    }
  }
}

// Pokemon API
export const pokemonApi = {
  getList: async (params: {
    limit?: number
    offset?: number
    search?: string
    sortBy?: 'name' | 'number'
    sortOrder?: 'asc' | 'desc'
  }): Promise<ApiResponse<PaginatedResponse<Pokemon>>> => {
    try {
      const response = await api.get('/pokemons', { params })
      return response.data
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch Pokémon' }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<PokemonDetail>> => {
    try {
      const response = await api.get(`/pokemons/${id}`)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch Pokémon details' }
    }
  }
}

