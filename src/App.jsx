import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SimpleRugStats from './pages/SimpleRugStatus';
import Info from './pages/Info';

  function AppRoutes() {
      return (
          <div>
             
              <Routes>
           
                  <Route path="/" element={<Home/>} />
                  <Route path="/about" element={<SimpleRugStats />} />
                  <Route path="/info" element={<Info />} />
              </Routes>
          </div>
      );
  }

  export default AppRoutes;