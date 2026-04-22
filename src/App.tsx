import { useState, useEffect } from 'react';
import WhitelistForm from './components/WhitelistForm';
import Checker from './components/Checker';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [view, setView] = useState<'join' | 'check'>('join');
  const [listData, setListData] = useState([]);

  const fetchList = async () => {
    const res = await fetch('/.netlify/functions/get-wallets');
    const data = await res.json();
    setListData(data);
  };

  useEffect(() => { if (view === 'check') fetchList(); }, [view]);

  return (
    <div className="min-h-screen selection:bg-brand-blue selection:text-white">
      <Toaster position="bottom-right" />
      
      {/* Simple Navigation */}
      <nav className="flex justify-between items-center p-6 border-b-4 border-black bg-white">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">TURDY</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('join')}
            className={`px-4 py-2 font-bold cursor-pointer uppercase transition ${view === 'join' ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
          >
          WL
          </button>
          <button 
            onClick={() => setView('check')}
            className={`px-4 py-2 font-bold cursor-pointer uppercase transition ${view === 'check' ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
          >
            Checker
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12">
        {view === 'join' ? (
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-black text-[#ffffff] uppercase mt-2">Whitelist Application</h2>
            </div>
            <WhitelistForm />
          </div>
        ) : (
          <Checker data={listData} />
        )}
      </main>


    </div>
  );
}