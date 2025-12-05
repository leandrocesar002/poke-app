import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

const renderHeader = (props = {}) => {
  const defaultProps = {
    onLogout: vi.fn(),
    searchValue: '',
    onSearchChange: vi.fn(),
    sortByNumber: null as boolean | null,
    onToggleSort: vi.fn(),
  }
  return render(
    <BrowserRouter>
      <Header {...defaultProps} {...props} />
    </BrowserRouter>
  )
}

describe('Header', () => {
  it('renders logo with Pokédex text', () => {
    renderHeader()
    expect(screen.getByText('Pokédex')).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderHeader()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('shows correct placeholder when sortByNumber is true', () => {
    renderHeader({ sortByNumber: true })
    expect(screen.getByPlaceholderText('Search by number')).toBeInTheDocument()
  })

  it('shows correct placeholder when sortByNumber is false', () => {
    renderHeader({ sortByNumber: false })
    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument()
  })

  it('calls onSearchChange after typing with debounce', async () => {
    const onSearchChange = vi.fn()
    renderHeader({ onSearchChange })
    
    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: 'pikachu' } })
    
    await waitFor(() => {
      expect(onSearchChange).toHaveBeenCalledWith('pikachu')
    }, { timeout: 500 })
  })

  it('shows clear button when input has value', () => {
    renderHeader({ searchValue: 'test' })
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when input is empty', () => {
    renderHeader({ searchValue: '' })
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('opens sort modal when clicking sort button', () => {
    renderHeader()
    const sortButton = screen.getByAltText('Sort options').closest('button')
    fireEvent.click(sortButton!)
    
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('calls onToggleSort when selecting sort option', () => {
    const onToggleSort = vi.fn()
    renderHeader({ onToggleSort })
    
    const sortButton = screen.getByAltText('Sort options').closest('button')
    fireEvent.click(sortButton!)
    
    const numberOption = screen.getByText('Number')
    fireEvent.click(numberOption)
    
    expect(onToggleSort).toHaveBeenCalledWith(true)
  })

  it('calls onToggleSort with false when selecting name option', () => {
    const onToggleSort = vi.fn()
    renderHeader({ onToggleSort, sortByNumber: true })
    
    const sortButton = screen.getByAltText('Sort options').closest('button')
    fireEvent.click(sortButton!)
    
    const nameOption = screen.getByText('Name')
    fireEvent.click(nameOption)
    
    expect(onToggleSort).toHaveBeenCalledWith(false)
  })

  it('closes modal when clicking overlay', () => {
    renderHeader()
    const sortButton = screen.getByAltText('Sort options').closest('button')
    fireEvent.click(sortButton!)
    
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
    
    const overlay = screen.getByText('Sort by:').parentElement?.parentElement
    fireEvent.click(overlay!)
    
    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument()
  })

  it('calls onLogout when clicking logout button', () => {
    const onLogout = vi.fn()
    renderHeader({ onLogout })
    
    const logoutButton = screen.getByLabelText('Logout')
    fireEvent.click(logoutButton)
    
    expect(onLogout).toHaveBeenCalled()
  })
})

