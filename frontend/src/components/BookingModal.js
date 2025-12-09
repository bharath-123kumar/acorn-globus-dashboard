import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function BookingModal({ selection, onClose }){
  const { court, hour, date } = selection;
  const start = new Date(`${date}T${String(hour).padStart(2,'0')}:00:00`);
  const end = new Date(start.getTime() + 60*60*1000);

  const [equipmentList, setEquipmentList] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState({});
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [pricing, setPricing] = useState(null);

  useEffect(()=>{ API.get('/equipment').then(r=>setEquipmentList(r.data)); API.get('/coaches').then(r=>setCoaches(r.data)); },[]);

  useEffect(()=>{ 
    async function calc(){
      try{
        const eqPayload = Object.entries(selectedEquipment).map(([id,qty])=>({ equipmentId: id, qty }));
        const res = await API.post('/bookings/price-preview', { courtId: court._id, startTime: start, endTime: end, equipment: eqPayload, coachId: selectedCoach });
        setPricing(res.data);
      }catch(e){ console.error(e); }
    }
    calc();
  },[selectedEquipment, selectedCoach]);

  async function submit(){
    try{
      const eqPayload = Object.entries(selectedEquipment).map(([id,qty])=>({ equipmentId: id, qty }));
      await API.post('/bookings', { courtId: court._1, startTime: start, endTime: end, equipment: eqPayload, coachId: selectedCoach });
      alert('Booked!');
      onClose();
    }catch(e){ alert('Error: '+ (e.response?.data?.error || e.message)); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-2/3">
        <h3 className="text-lg font-bold">Book {court.name} — {start.toLocaleString()}</h3>
        <div className="mt-4">
          <div className="mb-2">Equipment:</div>
          {equipmentList.map(eq => (
            <div key={eq._id} className="flex items-center gap-2">
              <label>{eq.name} (₹{eq.perUnitPrice})</label>
              <input type="number" min={0} max={5} value={selectedEquipment[eq._id]||0} onChange={e=>setSelectedEquipment({...selectedEquipment, [eq._id]: Number(e.target.value)})} />
            </div>
          ))}

          <div className="mt-4">Coach:</div>
          <select onChange={e=>setSelectedCoach(e.target.value)} value={selectedCoach||''}>
            <option value="">None</option>
            {coaches.map(c=> <option value={c._id} key={c._id}>{c.name} (₹{c.hourlyFee}/hr)</option>)}
          </select>

          <div className="mt-4">
            <h4 className="font-semibold">Price Preview</h4>
            <pre>{pricing? JSON.stringify(pricing, null, 2) : 'Calculating...'}</pre>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white" onClick={submit}>Confirm Booking</button>
            <button className="px-4 py-2 border" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
