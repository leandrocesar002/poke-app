import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import searchTextIcon from '../assets/searchText.svg'
import searchNumberIcon from '../assets/searchNumber.svg'
import filterDefaultIcon from '../assets/filterDefault.svg'
import closeIcon from '../assets/close.svg'
import pokeballIcon from '../assets/pokeball.svg'
import '../styles/Header.css'

interface HeaderProps {
  onLogout: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  sortByNumber: boolean | null
  onToggleSort: (sortByNumber: boolean) => void
}

function Header({ onLogout, searchValue, onSearchChange, sortByNumber, onToggleSort }: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchValue)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, onSearchChange])

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  const handleSortChange = (byNumber: boolean) => {
    onToggleSort(byNumber)
    setIsModalOpen(false)
  }

  const handleClearSearch = () => {
    setInputValue('')
    onSearchChange('')
  }

  // Determina qual ícone mostrar
  const getFilterIcon = () => {
    if (sortByNumber === null) return filterDefaultIcon
    return sortByNumber ? searchNumberIcon : searchTextIcon
  }

  const getPlaceholder = () => {
    if (sortByNumber === null) return "Search"
    return sortByNumber ? "Search by number" : "Search by name"
  }

  return (
    <>
      <header className="header">
        <div className="header-top">
          <Link to="/" className="logo">
            <img src={pokeballIcon} alt="" className="pokeball-logo" />
            <span>Pokédex</span>
          </Link>

          <button onClick={onLogout} className="logout-btn" aria-label="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

        <div className="header-search">
          <div className="search-field">
            <img 
              src={getFilterIcon()} 
              alt="search" 
              className="search-icon"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
            />
            {inputValue && (
              <button 
                className="clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <img src={closeIcon} alt="Clear" />
              </button>
            )}
          </div>
          <button 
            className="sort-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <img 
              src={getFilterIcon()} 
              alt="Sort options"
            />
          </button>
        </div>
      </header>

      {/* Sort Modal */}
      {isModalOpen && (
        <div className="sort-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sort-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sort by:</h3>
            <div className="sort-options">
              <label className="sort-option">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortByNumber === true}
                  onChange={() => handleSortChange(true)}
                />
                <span className="radio-custom"></span>
                <span>Number</span>
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortByNumber === false}
                  onChange={() => handleSortChange(false)}
                />
                <span className="radio-custom"></span>
                <span>Name</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
