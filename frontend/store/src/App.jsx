import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import Products from './pages/Products';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Special from './pages/Special';
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
      <Router>
        <div className="flex flex-col min-h-screen bg-background">

          {/* Navbar */}
          <div className="sticky top-0 z-50">
          <Navbar />
          </div>
          {/* Loading */}
          <LoadingProvider>
            {/* Main Content */}
          <main className="flex-grow pt-16 overflow-y-auto">
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/special" element={<Special />} />
              </Routes>
            </div>
          </main>
          </LoadingProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
            }}
          />
        </div>
      </Router>
  );
}

export default App;
