import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';

export default function SlotGrid({ courts }){
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{ 
    const arr = [];
    for(let h=8; h<22; h++){
      arr.push({ hour: h, label: `${h}:00 - ${h+1}:00` });
    }
    setSlots(arr);
  },[]);

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-4">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div>
        {slots.map(slot=> (
          <div key={slot.hour} className="mb-2">
            <div className="font-semibold">{slot.label}</div>
            <div className="flex gap-2 mt-1">
              {courts.map(c => (
                <button key={c._id} className="p-2 border rounded" onClick={()=>setSelected({ court: c, hour: slot.hour, date })}>
                  {c.name} — {c.type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selected && <BookingModal selection={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
