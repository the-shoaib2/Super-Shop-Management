import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import Products from './pages/Products';
import Home from './pages/Home';
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      <div className="page-transition min-h-screen bg-background">
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
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
