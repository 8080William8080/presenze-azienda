import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function CalendarioMensile() {
  const [assenze, setAssenze] = useState([]);
  const [dipendenti, setDipendenti] = useState([]);
  const [meseCorrente, setMeseCorrente] = useState(dayjs());

  useEffect(() => {
    axios.get('http://localhost:3001/api/dipendenti').then(res => setDipendenti(res.data));
    axios.get('http://localhost:3001/api/assenze').then(res => setAssenze(res.data));
  }, []);

  const giorniDelMese = [];
  const startOfMonth = meseCorrente.startOf('month').startOf('week');
  const endOfMonth = meseCorrente.endOf('month').endOf('week');

  for (let day = startOfMonth; day.isBefore(endOfMonth); day = day.add(1, 'day')) {
    giorniDelMese.push(day);
  }

  const assenzaPerGiorno = (giorno) => {
    const giornoStr = giorno.format('YYYY-MM-DD');
    return assenze.filter(a => a.data === giornoStr);
  };

  const coloreAssenza = (tipo) => {
    if (tipo === 'intera') return 'bg-red-300';
    if (tipo === 'mattina') return 'bg-yellow-300';
    if (tipo === 'pomeriggio') return 'bg-blue-300';
    return '';
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Calendario Mensile - {meseCorrente.format('MMMM YYYY')}</h2>
        <div className="space-x-2">
          <button onClick={() => setMeseCorrente(meseCorrente.subtract(1, 'month'))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">←</button>
          <button onClick={() => setMeseCorrente(meseCorrente.add(1, 'month'))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">→</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(g => (
          <div key={g} className="font-semibold text-gray-600">{g}</div>
        ))}
        {giorniDelMese.map(giorno => {
          const assenzeGiornaliere = assenzaPerGiorno(giorno);
          return (
            <div key={giorno.format()} className="border p-2 h-24 overflow-y-auto text-sm text-left bg-white shadow-sm rounded">
              <div className="font-medium">{giorno.format('D')}</div>
              {assenzeGiornaliere.map((a, i) => {
                const dip = dipendenti.find(d => d.id === a.dipendente_id);
                return (
                  <div key={i} className={`mt-1 px-1 rounded ${coloreAssenza(a.tipo)}`}>
                    {dip?.nome} {dip?.cognome}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}