import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PokemonDetailPage from './pages/PokemonDetailPage'

// Protected Route Component
function ProtectedRoute({ children, redirectTo = '/login' }: { children: React.ReactNode; redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="pokeball-loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

// Public Route Component (redirects to home if already logged in)
function PublicRoute({ children, redirectTo = '/pokemon/list' }: { children: React.ReactNode; redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="pokeball-loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/pokemon/list"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pokemon/:id"
        element={
          <ProtectedRoute>
            <PokemonDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/pokemon/list" replace />} />
      <Route path="*" element={<Navigate to="/pokemon/list" replace />} />
    </Routes>
  )
}

export default App
