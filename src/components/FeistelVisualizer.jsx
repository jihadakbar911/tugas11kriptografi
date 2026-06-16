import React, { useState } from 'react';
import { binToHex } from '../utils/desLogic';

const FormattedBin = ({ bin, chunk = 4 }) => {
  const chunks = [];
  for (let i = 0; i < bin.length; i += chunk) {
    chunks.push(bin.substring(i, i + chunk));
  }
  return <span className="mono" style={{ color: 'var(--text-accent)' }}>{chunks.join(' ')}</span>;
};

const SBoxVisualizer = ({ details }) => {
  return (
    <div>
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Proses <strong>Substitusi S-Box</strong> mengubah blok 48-bit menjadi 32-bit. Blok dipecah menjadi 8 bagian (masing-masing 6-bit). 
        Untuk setiap 6-bit, <strong>bit pertama dan keenam</strong> menentukan nilai Baris (0-3), sedangkan <strong>4 bit tengahnya</strong> menentukan nilai Kolom (0-15). 
        Angka pada baris dan kolom tersebut dicari pada tabel S-Box terkait untuk mendapatkan output 4-bit baru.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {details.map((boxDetail, idx) => (
          <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-accent)' }}>Tabel S-Box {boxDetail.box}</div>
            <div className="mono" style={{ marginBottom: '0.3rem' }}>Input (6-bit) : {boxDetail.chunk}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Baris : {boxDetail.row} <span className="text-secondary">(bit 1 & 6)</span></span>
              <span>Kolom : {boxDetail.col} <span className="text-secondary">(bit 2-5)</span></span>
            </div>
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
              Output (4-bit): <span className="mono accent-text" style={{ fontSize: '1.1rem' }}>{boxDetail.valBin}</span> 
              <span className="text-secondary" style={{ marginLeft: '0.5rem' }}>(Dec: {boxDetail.val})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoundDetails = ({ data, roundNum }) => {
  const [expanded, setExpanded] = useState(roundNum === 1 || roundNum === 16);

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid var(--border-glass)', borderRadius: '8px', overflow: 'hidden' }}>
      <div 
        style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Putaran {roundNum}</div>
        <div className="mono text-secondary" style={{ fontSize: '0.9rem' }}>
          L: <span style={{ color: '#fff' }}>{binToHex(data.L)}</span> | R: <span style={{ color: '#fff' }}>{binToHex(data.R)}</span>
          <span style={{ marginLeft: '1rem' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {expanded && (
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-glass)' }}>
          
          <div className="info-box">
            Pada awal putaran, kita memiliki blok Kiri (<strong>L</strong>) dan Kanan (<strong>R</strong>) dari langkah sebelumnya. 
            Blok R akan dimasukkan ke dalam <strong>Fungsi Feistel (F-Function)</strong> bersama dengan Subkunci K. 
            Hasil akhir Fungsi F kemudian di-XOR-kan dengan blok L lama untuk menghasilkan blok R baru. Blok L baru adalah blok R lama.
          </div>

          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div className="form-label">Blok Kiri (L{roundNum-1}) - 32 bit:</div>
              <FormattedBin bin={data.prevL} />
            </div>
            <div>
              <div className="form-label">Blok Kanan (R{roundNum-1}) - 32 bit:</div>
              <FormattedBin bin={data.prevR} />
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(0,229,255,0.05)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Fungsi Feistel (F-Function)</h4>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="form-label">1. Ekspansi E (Memperluas R dari 32-bit ke 48-bit)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Beberapa bit pada batas luar diduplikasi untuk memperlebar ukuran agar sama dengan ukuran Subkunci.</div>
              <FormattedBin bin={data.f_details.E_R} chunk={6} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="form-label">2. Kunci K{roundNum} (Subkunci 48-bit)</div>
              <FormattedBin bin={data.K} chunk={6} />
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px' }}>
              <div className="form-label">3. Hasil XOR (Ekspansi ⊕ Kunci)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bit-bit dari Ekspansi E digabungkan dengan Subkunci menggunakan gerbang logika Exclusive-OR (XOR).</div>
              <FormattedBin bin={data.f_details.xor_res} chunk={6} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>4. Substitusi S-Box (Menjadi 32-bit)</div>
              <SBoxVisualizer details={data.f_details.sbox_details} />
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
              <div className="form-label">5. Permutasi P (Mengacak kembali posisi 32-bit)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Ini adalah hasil akhir dari Fungsi Feistel.</div>
              <FormattedBin bin={data.f_details.P_res} />
            </div>
          </div>

          <div className="info-box" style={{ background: 'rgba(138, 43, 226, 0.05)', borderLeftColor: '#8a2be2' }}>
            <strong>Penyelesaian Putaran:</strong> <br/>
            L{roundNum} <strong>=</strong> R{roundNum-1} (Blok Kiri baru adalah Blok Kanan lama).<br/>
            R{roundNum} <strong>=</strong> L{roundNum-1} ⊕ Hasil Fungsi F (Blok Kanan baru adalah Blok Kiri lama di-XOR-kan dengan hasil fungsi P dari atas).
          </div>

          <div className="grid-2" style={{ gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <div className="form-label text-accent">L{roundNum} Baru (32-bit)</div>
              <FormattedBin bin={data.L} />
            </div>
            <div>
              <div className="form-label text-accent">R{roundNum} Baru (32-bit)</div>
              <FormattedBin bin={data.R} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default function FeistelVisualizer({ ip, rounds }) {
  if (!rounds || rounds.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', animationDelay: '0.3s' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔄</span> Proses Feistel (16 Putaran)
      </h3>
      
      <div className="info-box">
        <strong>Penjelasan Teoritis:</strong> Enkripsi DES menggunakan skema Feistel sebanyak 16 putaran. 
        Sebelum masuk ke putaran pertama, urutan bit dari teks input diacak terlebih dahulu menggunakan tabel <strong>Initial Permutation (IP)</strong>.
        Teks 64-bit ini kemudian dibagi menjadi Kiri (L0) dan Kanan (R0).
      </div>

      <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Langkah Awal: Initial Permutation (IP)</h4>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Hasil pengacakan awal 64-bit yang kemudian dibagi dua.
        </div>
        <div className="form-label" style={{ marginTop: '1rem' }}>Hasil IP (64-bit):</div>
        <FormattedBin bin={ip} chunk={8} />
      </div>

      <h4 style={{ marginBottom: '1rem' }}>Detail 16 Putaran:</h4>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Klik pada setiap baris putaran di bawah ini untuk melihat detail perhitungannya (Nilai Fungsi F, Ekspansi, S-Box, dll). Putaran 1 dan 16 terbuka secara default.
      </div>

      <div>
        {rounds.map((roundData) => (
          <RoundDetails key={roundData.round} roundNum={roundData.round} data={roundData} />
        ))}
      </div>
    </div>
  );
}
