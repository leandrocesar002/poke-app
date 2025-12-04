import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

// Placeholder - será substituído pelo componente real
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Pokédex
      </h1>
      <p className="text-gray-600">
        Skeleton inicial configurado com sucesso!
      </p>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-pokemon-fire text-white rounded-lg">Fire</div>
        <div className="px-4 py-2 bg-pokemon-water text-white rounded-lg">Water</div>
        <div className="px-4 py-2 bg-pokemon-grass text-white rounded-lg">Grass</div>
        <div className="px-4 py-2 bg-pokemon-electric text-black rounded-lg">Electric</div>
      </div>
    </div>
  )
}

export default App

