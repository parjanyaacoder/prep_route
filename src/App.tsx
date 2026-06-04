function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tailwind CSS Testing
        </h1>
        <p className="text-gray-600">
          If you see this card styled properly with a shadow and rounded corners, Tailwind is working!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors shadow-sm">
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
