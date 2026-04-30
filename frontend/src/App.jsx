import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // <-- Importando nossa nova tela
import Cadastro from './pages/Cadastro'; // <-- Importando o Cadastro
import Dashboard from './pages/Dashboard'; // <-- Importando o Dashboard
import Categorias from './pages/Categorias'; // <-- Importando Categoria
import Lancamentos from './pages/Lancamentos'; // <-- Importando Lançamentos

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/lancamentos" element={<Lancamentos />} />
      </Routes>
    </div>
  );
}

export default App;