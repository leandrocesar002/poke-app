import { createContext, useContext, useState, ReactNode } from 'react'

interface FilterContextType {
  sortByNumber: boolean | null
  setSortByNumber: (value: boolean) => void
  search: string
  setSearch: (value: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [sortByNumber, setSortByNumber] = useState<boolean | null>(null)
  const [search, setSearch] = useState('')

  return (
    <FilterContext.Provider value={{ sortByNumber, setSortByNumber, search, setSearch }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
