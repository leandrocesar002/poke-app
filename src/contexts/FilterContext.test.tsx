import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FilterProvider, useFilter } from './FilterContext'

const TestComponent = () => {
  const { sortByNumber, setSortByNumber, search, setSearch } = useFilter()
  
  return (
    <div>
      <span data-testid="sortByNumber">{String(sortByNumber)}</span>
      <span data-testid="search">{search}</span>
      <button onClick={() => setSortByNumber(true)}>Sort by Number</button>
      <button onClick={() => setSortByNumber(false)}>Sort by Name</button>
      <input 
        data-testid="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

describe('FilterContext', () => {
  it('provides initial null sortByNumber state', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    expect(screen.getByTestId('sortByNumber').textContent).toBe('null')
  })

  it('provides initial empty search state', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    expect(screen.getByTestId('search').textContent).toBe('')
  })

  it('updates sortByNumber to true', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    act(() => {
      fireEvent.click(screen.getByText('Sort by Number'))
    })
    
    expect(screen.getByTestId('sortByNumber').textContent).toBe('true')
  })

  it('updates sortByNumber to false', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    act(() => {
      fireEvent.click(screen.getByText('Sort by Name'))
    })
    
    expect(screen.getByTestId('sortByNumber').textContent).toBe('false')
  })

  it('updates search value', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    const input = screen.getByTestId('search-input')
    
    act(() => {
      fireEvent.change(input, { target: { value: 'pikachu' } })
    })
    
    expect(screen.getByTestId('search').textContent).toBe('pikachu')
  })

  it('persists state across renders', () => {
    const { rerender } = render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    act(() => {
      fireEvent.click(screen.getByText('Sort by Number'))
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'char' } })
    })
    
    rerender(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )
    
    expect(screen.getByTestId('sortByNumber').textContent).toBe('true')
    expect(screen.getByTestId('search').textContent).toBe('char')
  })

  it('throws error when useFilter is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useFilter must be used within a FilterProvider')
    
    consoleError.mockRestore()
  })
})

