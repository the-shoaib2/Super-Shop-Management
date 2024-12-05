import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import Products from './pages/Products';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
        <Router>
          <Navbar />
          <div className="flex-1 pt-16"> 
            <main className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
            }}
          />
        </Router>
      </div>
    </LoadingProvider>
  );
}

export default App;
