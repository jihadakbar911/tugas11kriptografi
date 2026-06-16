import React, { useState } from 'react';
import InputSection from './components/InputSection';
import KeyScheduleVisualizer from './components/KeyScheduleVisualizer';
import FeistelVisualizer from './components/FeistelVisualizer';
import { simulateDES } from './utils/desLogic';

const FormattedBin = ({ bin, chunk = 4 }) => {
  const chunks = [];
  for (let i = 0; i < bin.length; i += chunk) {
    chunks.push(bin.substring(i, i + chunk));
  }
  return <span className="mono" style={{ color: 'var(--text-accent)' }}>{chunks.join(' ')}</span>;
};

function App() {
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulate = (dataBin, keyBin, mode) => {
    try {
      const result = simulateDES(dataBin, keyBin, mode);
      setSimulationResult(result);
      
      // Scroll to result smoothly
      setTimeout(() => {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert("Terjadi kesalahan komputasi DES.");
      console.error(err);
    }
  };

  const handleReset = () => {
    setSimulationResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="animate-fade-in">DES Web Simulator</h1>
        <p className="subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Visualisasi interaktif Algoritma Data Encryption Standard
        </p>
      </header>

      <main>
        <InputSection onSimulate={handleSimulate} />

        {simulationResult && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn btn-secondary" onClick={handleReset}>
                🔄 Clear / Reset Hasil
              </button>
            </div>

            <KeyScheduleVisualizer log={simulationResult.keySchedule} />
            
            <FeistelVisualizer 
              ip={simulationResult.IP} 
              rounds={simulationResult.rounds} 
            />

            <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', animationDelay: '0.4s', border: '1px solid var(--accent-color)' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏁</span> Hasil Akhir ({simulationResult.mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'})
              </h3>
              
              <div className="grid-2">
                <div>
                  <div className="form-label">Pre-Output (R16 + L16):</div>
                  <FormattedBin bin={simulationResult.preOutput} chunk={8} />
                </div>
                <div>
                  <div className="form-label">Final Permutation (IP-1 Invers):</div>
                  <FormattedBin bin={simulationResult.finalOutput} chunk={8} />
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div className="form-label" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Nilai Heksadesimal:</div>
                <div className="mono accent-text" style={{ fontSize: '2rem', letterSpacing: '4px' }}>
                  {simulationResult.finalOutputHex}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>Latihan Proyek Mata Kuliah Kriptografi &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
