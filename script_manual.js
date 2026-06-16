import fs from 'fs';
import { simulateDES, hexToBin, binToHex } from './src/utils/desLogic.js';

const inputHex = '0123456789ABCDEF';
const keyHex = '133457799BBCDFF1';

const inputBin = hexToBin(inputHex);
const keyBin = hexToBin(keyHex);

const result = simulateDES(inputBin, keyBin, 'encrypt');

let md = `# Perhitungan Manual DES\n\n`;
md += `**Data Input (Hex):** \`${inputHex}\`\n`;
md += `**Data Input (Bin):** \`${inputBin}\`\n\n`;
md += `**Kunci (Hex):** \`${keyHex}\`\n`;
md += `**Kunci (Bin):** \`${keyBin}\`\n\n`;

md += `---\n\n## 1. Pembangkitan Subkunci (Key Schedule)\n\n`;
const keyLog = result.keySchedule;
const pc1 = keyLog.find(step => step.step === 'PC-1');

md += `### Langkah 1.1: Permuted Choice 1 (PC-1)\n`;
md += `Menghapus bit paritas dan mengacak posisi bit kunci menjadi 56-bit.\n`;
md += `- **Kunci setelah PC-1 (56-bit):** \`${pc1.key56}\`\n`;
md += `- **C0 (28-bit kiri):** \`${pc1.C}\`\n`;
md += `- **D0 (28-bit kanan):** \`${pc1.D}\`\n\n`;

md += `### Langkah 1.2: Left Shift & PC-2\n`;
const roundsKeys = keyLog.filter(step => step.round);

roundsKeys.forEach(r => {
    md += `#### Putaran ${r.round} (Shift: ${r.shift})\n`;
    md += `- **C${r.round}:** \`${r.C}\`\n`;
    md += `- **D${r.round}:** \`${r.D}\`\n`;
    md += `- **Gabungan C${r.round}D${r.round} (56-bit):** \`${r.C}${r.D}\`\n`;
    md += `- **K${r.round} (Setelah PC-2, 48-bit):** \`${r.K}\`\n\n`;
});

md += `---\n\n## 2. Proses Enkripsi (Feistel 16 Putaran)\n\n`;
md += `### Langkah 2.1: Initial Permutation (IP)\n`;
md += `Input teks awal diacak dengan matriks IP menjadi 64-bit.\n`;
md += `- **Hasil IP:** \`${result.IP}\`\n`;
md += `- **L0 (32-bit kiri):** \`${result.rounds[0].prevL}\`\n`;
md += `- **R0 (32-bit kanan):** \`${result.rounds[0].prevR}\`\n\n`;

md += `### Langkah 2.2: 16 Putaran (Round)\n`;

result.rounds.forEach(r => {
    md += `#### Round ${r.round}\n`;
    md += `**Kondisi Awal:**\n`;
    md += `- **L${r.round-1}:** \`${r.prevL}\`\n`;
    md += `- **R${r.round-1}:** \`${r.prevR}\`\n\n`;
    
    md += `**Fungsi F:**\n`;
    md += `1. **Ekspansi (E) terhadap R${r.round-1}:** \`${r.f_details.E_R}\` (48-bit)\n`;
    md += `2. **XOR dengan K${r.round} (${r.K}):** \`${r.f_details.xor_res}\` (48-bit)\n`;
    md += `3. **Substitusi S-Box (32-bit):**\n`;
    
    r.f_details.sbox_details.forEach(sb => {
        md += `   - **S-Box ${sb.box}:** Input \`${sb.chunk}\` -> Baris ${sb.row}, Kolom ${sb.col} -> Output Dec \`${sb.val}\` (Bin \`${sb.valBin}\`)\n`;
    });
    md += `   - **Hasil Gabungan S-Box:** \`${r.f_details.sbox_res}\`\n`;
    md += `4. **Permutasi P:** \`${r.f_details.P_res}\`\n\n`;

    md += `**Penyelesaian Round ${r.round}:**\n`;
    md += `- **L${r.round} = R${r.round-1}:** \`${r.L}\`\n`;
    md += `- **R${r.round} = L${r.round-1} XOR P:** \`${r.R}\`\n\n`;
});

md += `---\n\n## 3. Hasil Akhir (Final Output)\n\n`;
md += `### Langkah 3.1: Penggabungan (Pre-Output)\n`;
md += `Setelah round 16 selesai, L16 dan R16 digabungkan terbalik (R16 lalu L16).\n`;
md += `- **Pre-Output (R16 + L16):** \`${result.preOutput}\`\n\n`;

md += `### Langkah 3.2: Inverse Initial Permutation (IP-1)\n`;
md += `- **Ciphertext (Bin):** \`${result.finalOutput}\`\n`;
md += `- **Ciphertext (Hex):** \`${result.finalOutputHex}\`\n`;

const outputPath = 'C:\\Users\\OJES\\.gemini\\antigravity-ide\\brain\\9df53f8a-d8ff-43d0-8876-7a4d271b2d18\\perhitungan_manual_des.md';
fs.writeFileSync(outputPath, md);
console.log('Successfully wrote manual calculation to artifact.');
