import '../styles/Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)
    
    if (currentPage > 3) pages.push('...')
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) pages.push(i)
    
    if (currentPage < totalPages - 2) pages.push('...')
    
    pages.push(totalPages)
    
    return pages
  }

  return (
    <nav className="pagination">
      <button
        className="page-btn nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <div className="page-numbers">
        {getVisiblePages().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="dots">...</span>
          ) : (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="page-btn nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </nav>
  )
}

export default Pagination

