import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro'; // A tela de usuário volta a brilhar aqui
import Dashboard from './pages/Dashboard';
import Atributos from './pages/Atributos'; // <-- Nome novo importado
import Lancamentos from './pages/Lancamentos';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/atributos" element={<Atributos />} /> {/* <-- Rota nova */}
        <Route path="/lancamentos" element={<Lancamentos />} />
      </Routes>
    </div>
  );
}

export default App;