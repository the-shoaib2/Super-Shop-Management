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
            position="top-right"
            gutter={12}
            containerClassName="font-sans"
            toastOptions={{
              duration: 3000,
              className: '!bg-background !text-foreground border border-border shadow-lg rounded-xl',
              success: {
                icon: '🎉',
                className: '!bg-emerald-50 !text-emerald-600 !border-emerald-100',
                style: {
                  padding: '16px',
                },
              },
              error: {
                icon: '❌',
                className: '!bg-rose-50 !text-rose-600 !border-rose-100',
                style: {
                  padding: '16px',
                },
              },
              loading: {
                icon: '⏳',
                className: '!bg-blue-50 !text-blue-600 !border-blue-100',
                style: {
                  padding: '16px',
                },
              },
            }}
          />
        </Router>
      </div>
    </LoadingProvider>
  );
}

export default App;
