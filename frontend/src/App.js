import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PredictorPage from './pages/PredictorPage';
import PreInvestmentPage from './pages/PreInvestmentPage';
import ExistingBusinessPage from './pages/ExistingBusinessPage';
import ContactPage from './pages/ContactPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predictor" element={<PredictorPage />} />
            <Route path="/predictor/pre-investment" element={<PreInvestmentPage />} />
            <Route path="/predictor/existing-business" element={<ExistingBusinessPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;