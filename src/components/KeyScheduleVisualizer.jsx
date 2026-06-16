import React from 'react';
import { binToHex } from '../utils/desLogic';

const FormattedBin = ({ bin, chunk = 4 }) => {
  const chunks = [];
  for (let i = 0; i < bin.length; i += chunk) {
    chunks.push(bin.substring(i, i + chunk));
  }
  return <span className="mono" style={{ color: 'var(--text-accent)' }}>{chunks.join(' ')}</span>;
};

export default function KeyScheduleVisualizer({ log }) {
  if (!log || log.length === 0) return null;

  const pc1 = log.find(step => step.step === 'PC-1');
  const rounds = log.filter(step => step.round);

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', animationDelay: '0.2s' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔑</span> Pembangkitan Subkunci (Key Schedule)
      </h3>
      
      <div className="info-box">
        <strong>Penjelasan Teoritis:</strong> Algoritma DES membangkitkan 16 subkunci (masing-masing 48-bit) dari satu kunci utama (64-bit). 
        Setiap subkunci ini nantinya akan digunakan secara unik untuk tiap putaran Feistel.
      </div>

      <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Langkah 1: Permuted Choice 1 (PC-1)</h4>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Kunci awal 64-bit diproses menggunakan tabel <strong>PC-1</strong>. Bit ke-8, 16, 24, dst (bit paritas) dibuang sehingga menyisakan 56 bit. 
          Kemudian, 56 bit tersebut dibagi menjadi dua bagian sama besar: <strong>C0</strong> (28-bit kiri) dan <strong>D0</strong> (28-bit kanan).
        </div>
        <div className="grid-2">
          <div>
            <div className="form-label">Kunci 56-bit (Setelah PC-1):</div>
            <FormattedBin bin={pc1.key56} chunk={7} />
          </div>
          <div>
            <div className="form-label">Pemecahan C0 & D0:</div>
            <div style={{ marginBottom: '0.5rem' }}><span className="text-secondary">C0 (28-bit): </span><FormattedBin bin={pc1.C} chunk={7} /></div>
            <div><span className="text-secondary">D0 (28-bit): </span><FormattedBin bin={pc1.D} chunk={7} /></div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Langkah 2: Left Shift & PC-2</h4>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Pada setiap putaran (1 hingga 16), blok C dan D digeser ke kiri (<strong>Left Shift</strong>) sebanyak 1 atau 2 bit sesuai jadwal pergeseran DES. 
          Setelah digeser, blok C dan D digabungkan (menjadi 56-bit) lalu diproses melalui tabel <strong>PC-2</strong> yang akan mengacak dan memilih 48-bit saja sebagai Subkunci (<strong>K</strong>) putaran tersebut.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '0.8rem' }}>Putaran</th>
                <th style={{ padding: '0.8rem' }}>Shift</th>
                <th style={{ padding: '0.8rem' }}>C (28-bit)</th>
                <th style={{ padding: '0.8rem' }}>D (28-bit)</th>
                <th style={{ padding: '0.8rem' }}>K (Subkunci 48-bit)</th>
                <th style={{ padding: '0.8rem' }}>Hex</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map(r => (
                <tr key={r.round} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}><strong>{r.round}</strong></td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>{r.shift}</td>
                  <td style={{ padding: '0.8rem' }}><FormattedBin bin={r.C} chunk={7} /></td>
                  <td style={{ padding: '0.8rem' }}><FormattedBin bin={r.D} chunk={7} /></td>
                  <td style={{ padding: '0.8rem' }}><FormattedBin bin={r.K} chunk={6} /></td>
                  <td style={{ padding: '0.8rem' }} className="mono">{binToHex(r.K)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
