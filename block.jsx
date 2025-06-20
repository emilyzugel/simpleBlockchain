import React from 'react';

function Block({ index, data, prevHash, nonce, hash }) {
  return (
    <div className="block new">
      <h2>Bloco #{index}</h2>

      <label>Dados do bloco:</label>
      <textarea rows="3" readOnly value={data} />

      <label>Hash do bloco anterior:</label>
      <input type="text" readOnly value={prevHash} />

      <label>Nonce:</label>
      <input type="text" readOnly value={nonce} />

      <label>Hash do bloco:</label>
      <input type="text" readOnly value={hash} />
    </div>
  );
}

export default Block;
