import * as React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import MainAppFrame from './components/MainAppFrame';
import Cart from './components/Cart';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/remove-background" element={<MainAppFrame />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={NotFound} />
      </Routes>
    </Router>
  );
};
export default App;
