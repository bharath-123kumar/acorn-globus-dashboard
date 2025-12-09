import React, { useEffect, useState } from 'react';
import API from './services/api';
import SlotGrid from './components/SlotGrid';

function App(){
  const [courts, setCourts] = useState([]);
  useEffect(()=>{ API.get('/courts').then(r=>setCourts(r.data)); },[]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Acorn Globus — Court Booking</h1>
      <SlotGrid courts={courts} />
    </div>
  );
}

export default App;
