import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Theory from './pages/Theory';
import ComparisonTool from './pages/ComparisonTool';
import CaseStudies from './pages/CaseStudies';
import Conclusion from './pages/Conclusion';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'theory':
        return <Theory />;
      case 'comparison':
        return <ComparisonTool />;
      case 'case-studies':
        return <CaseStudies />;
      case 'conclusion':
        return <Conclusion onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
