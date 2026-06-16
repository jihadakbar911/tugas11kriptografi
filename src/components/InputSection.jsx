import React, { useState, useEffect } from 'react';

const strToHex = (str) => {
  let hex = '';
  for(let i=0; i<str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex.toUpperCase().padEnd(16, '0').substring(0, 16);
};

export default function InputSection({ onSimulate }) {
  const [inputType, setInputType] = useState('hex'); // 'hex' | 'text' | 'bin'
  const [inputText, setInputText] = useState('');
  const [inputHex, setInputHex] = useState('0123456789ABCDEF');
  const [keyHex, setKeyHex] = useState('133457799BBCDFF1');
  const [mode, setMode] = useState('encrypt'); // 'encrypt' | 'decrypt'

  useEffect(() => {
    if (inputType === 'text' && inputText) {
      setInputHex(strToHex(inputText));
    }
  }, [inputText, inputType]);

  const hexToBin = (hex) => {
    try {
      return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    } catch {
      return '';
    }
  };

  const handleSimulate = () => {
    const dataBin = hexToBin(inputHex);
    const keyBin = hexToBin(keyHex);
    if (dataBin.length !== 64 || keyBin.length !== 64) {
      alert('Input dan Key harus merepresentasikan 64-bit data (16 karakter Hex).');
      return;
    }
    onSimulate(dataBin, keyBin, mode);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Konfigurasi DES</h2>
      
      <div className="grid-2">
        <div>
          <div className="form-group">
            <label className="form-label">Mode Operasi</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="mode" value="encrypt" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} />
                Enkripsi
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="mode" value="decrypt" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} />
                Dekripsi
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipe Input</label>
            <select 
              className="input-field" 
              value={inputType} 
              onChange={(e) => setInputType(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            >
              <option value="hex">Heksadesimal (Default)</option>
              <option value="text">Teks Biasa (Otomatis ke Hex)</option>
            </select>
          </div>

          {inputType === 'text' && (
            <div className="form-group">
              <label className="form-label">Plaintext (Teks Maks 8 Karakter)</label>
              <input 
                type="text" 
                className="input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.substring(0, 8))}
                placeholder="Ex: HALO1234"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Data (16 Karakter Hex = 64-bit)</label>
            <input 
              type="text" 
              className="input-field mono"
              value={inputHex}
              onChange={(e) => setInputHex(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').substring(0, 16))}
              placeholder="0123456789ABCDEF"
              readOnly={inputType === 'text'}
            />
          </div>
        </div>

        <div>
          <div className="form-group">
            <label className="form-label">Kunci / Key (16 Karakter Hex = 64-bit)</label>
            <input 
              type="text" 
              className="input-field mono"
              value={keyHex}
              onChange={(e) => setKeyHex(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').substring(0, 16))}
              placeholder="133457799BBCDFF1"
            />
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSimulate}>
              {mode === 'encrypt' ? '⚡ Jalankan Enkripsi' : '🔓 Jalankan Dekripsi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
