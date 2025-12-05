import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders current page as active', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    const activeButton = screen.getByText('1')
    expect(activeButton).toHaveClass('active')
  })

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0]
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />)
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when clicking page number', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    const page3Button = screen.getByText('3')
    fireEvent.click(page3Button)
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with previous page when clicking prev', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0]
    fireEvent.click(prevButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when clicking next', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    fireEvent.click(nextButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('shows all pages when totalPages is 5 or less', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1)
  })
})

