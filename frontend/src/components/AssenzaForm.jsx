import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssenzaForm() {
  const [dipendenti, setDipendenti] = useState([]);
  const [form, setForm] = useState({
    dipendente_id: '',
    data: '',
    tipo: 'intera',
    motivazione: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3001/api/dipendenti')
      .then(res => setDipendenti(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/assenze', form);
    alert("Assenza inserita!");
    setForm({ dipendente_id: '', data: '', tipo: 'intera', motivazione: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md border max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Nuova Assenza</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Dipendente</label>
        <select value={form.dipendente_id} onChange={e => setForm({ ...form, dipendente_id: e.target.value })} className="w-full border p-2 rounded">
          <option value="">Seleziona</option>
          {dipendenti.map(d => (
            <option key={d.id} value={d.id}>{d.nome} {d.cognome}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Data</label>
        <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="w-full border p-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Tipo di Assenza</label>
        <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full border p-2 rounded">
          <option value="intera">Assenza intera</option>
          <option value="mattina">Solo mattina</option>
          <option value="pomeriggio">Solo pomeriggio</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Motivazione (opzionale)</label>
        <input type="text" value={form.motivazione} onChange={e => setForm({ ...form, motivazione: e.target.value })} className="w-full border p-2 rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Salva</button>
    </form>
  );
}