import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import your pages
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import About from './Pages/About';
import Contact from './Pages/Contact';
import CustomOrder from './Pages/CustomOrder';
import Earrings from './Pages/Earrings';
import Necklace from './Pages/Necklace';
import Rings from './Pages/Rings';
import Miscellaneous from './Pages/Miscellaneous';

function App() {
  return (
    <BrowserRouter>
      {/* The Navbar stays at the top of every page */}
      <Navbar />

      {/* The Routes section swaps out the middle content based on the URL */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/shop/earrings" element={<Earrings />} />
          <Route path="/shop/necklaces" element={<Necklace />} />
          <Route path="/shop/rings" element={<Rings />} />
          <Route path="shop/miscellaneous" element={<Miscellaneous />} />
          {/* Optional: A catch-all route for 404 Not Found */}
          <Route path="*" element={<div style={{textAlign: 'center', padding: '4rem'}}>Page not found!</div>} />
        </Routes>
      </main>

      {/* The Footer stays at the bottom of every page */}
      <Footer />
    
    </BrowserRouter>
  );
}

export default App;
