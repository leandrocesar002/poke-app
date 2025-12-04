import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.css'

interface HeaderProps {
  onLogout: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  sortByNumber: boolean
  onToggleSort: () => void
}

function Header({ onLogout, searchValue, onSearchChange, sortByNumber, onToggleSort }: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, onSearchChange])

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo">
          <div className="pokeball-logo">
            <div className="ball-top"></div>
            <div className="ball-bottom"></div>
            <div className="ball-center"></div>
          </div>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4-4"/>
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search"
          />
        </div>
        <button 
          className={`sort-btn ${sortByNumber ? 'active' : ''}`}
          onClick={onToggleSort}
        >
          #
        </button>
      </div>
    </header>
  )
}

export default Header

