import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SimpleRugStats from './pages/SimpleRugStatus';
import Info from './pages/Info';
import Menu from './pages/Menu';
import RugHistory from './pages/RugHistory';

  function AppRoutes() {
      return (
          <div>
             
              <Routes>
                 <Route path="/" element={<Menu/>} />
                 <Route path="/rugHistory" element={<RugHistory/>} />
                  <Route path="/create" element={<Home/>} />
                  <Route path="/about" element={<SimpleRugStats />} />
                  <Route path="/info" element={<Info />} />
              </Routes>
          </div>
      );
  }

  export default AppRoutes;
