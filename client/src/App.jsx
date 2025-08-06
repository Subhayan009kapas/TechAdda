import React, { useState } from 'react';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen'; // ✅ import splash
import './styles/global.css';
import './styles/theme.css';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          <Navbar />
          <AppRoutes />
        </>
      )}
    </>
  );
};

export default App;
