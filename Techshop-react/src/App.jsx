import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
const MainContent = () => {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen bg-[#0b0c10] flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <Navbar />
      </div>
  );
};
function App(){
  return(
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  )
}
export default App;