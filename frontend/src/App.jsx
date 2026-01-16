import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BOQNormalize from './pages/BOQNormalize';
import VendorSelect from './pages/VendorSelect';
import Substitution from './pages/Substitution';
import CreatePO from './pages/CreatePO';

function App() {
  const [normalizedItems, setNormalizedItems] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState({});
  const [substitutions, setSubstitutions] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/boq-normalize" replace />} />
          <Route 
            path="boq-normalize" 
            element={<BOQNormalize onComplete={setNormalizedItems} />} 
          />
          <Route 
            path="vendor-select" 
            element={<VendorSelect items={normalizedItems} onComplete={setSelectedVendors} />} 
          />
          <Route 
            path="substitution" 
            element={<Substitution selectedVendors={selectedVendors} onComplete={setSubstitutions} />} 
          />
          <Route 
            path="create-po" 
            element={<CreatePO selectedVendors={selectedVendors} substitutions={substitutions} />} 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
