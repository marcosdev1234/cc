import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SimpleRugStats from './pages/SimpleRugStatus';


function AppRoutes() {
    return (
        <div>
            <nav>
                <Link to="/">Inicio</Link>
                <Link to="/about">Acerca de</Link>
                <Link to="/contact">Contacto</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<SimpleRugStats />} />
      
            </Routes>
        </div>
    );
}

export default AppRoutes;