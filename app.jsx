import React, { useState } from 'react';
import Block from './Block';
import './App.css';

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

function App() {
  const [data, setData] = useState('');
  const [prevHash, setPrevHash] = useState('0000000000000000000000000000000000000000000000000000000000000000');
  const [nonce, setNonce] = useState('');
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState('');
  const [blockchain, setBlockchain] = useState([]);

  const mine = async () => {
    setStatus('');
    const trimmedData = data.trim();
    const trimmedPrevHash = prevHash.trim();

    if (!/^[a-f0-9]{64}$/i.test(trimmedPrevHash)) {
      setStatus('Hash do bloco anterior inválido. Deve ter 64 caracteres hexadecimais.');
      return;
    }
    if (!trimmedData) {
      setStatus('Por favor, preencha os dados do bloco.');
      return;
    }

    setStatus('Minerando... aguarde');
    let nonce = 0;
    let hash = '';
    const start = performance.now();

    while (true) {
      const blockString = trimmedPrevHash + trimmedData + nonce;
      hash = await sha256(blockString);
      if (hash.startsWith('0000')) break;
      nonce++;

      if (nonce % 10000 === 0) {
        setStatus(`Minerando... tentativas: ${nonce}`);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const end = performance.now();

    setNonce(nonce);
    setHash(hash);
    setStatus(`✅ Bloco minerado em ${(end - start).toFixed(2)} ms com nonce = ${nonce}`);

    const newBlock = { data: trimmedData, prevHash: trimmedPrevHash, nonce, hash };
    setBlockchain([...blockchain, newBlock]);

    setPrevHash(hash);
    setData('');
    setNonce('');
    setHash('');
  };

  return (
    <div className="blockchain-container">
      <div className="block">
        <h2>Minerar Novo Bloco</h2>

        <label>Dados do bloco (transações)</label>
        <textarea
          rows="4"
          placeholder="Ex: Alice envia 1 BTC para Bob"
          value={data}
          onChange={e => setData(e.target.value)}
        />

        <label>Hash do bloco anterior</label>
        <input type="text" value={prevHash} onChange={e => setPrevHash(e.target.value)} />

        <label>Nonce</label>
        <input type="text" value={nonce} readOnly />

        <label>Hash do bloco</label>
        <input type="text" value={hash} readOnly />

        <button onClick={mine}>Minerar bloco</button>
        <p id="status">{status}</p>
      </div>

      <div id="chain">
        {blockchain.map((block, idx) => (
          <Block key={idx} index={idx} {...block} />
        ))}
      </div>
    </div>
  );
}

export default App;
