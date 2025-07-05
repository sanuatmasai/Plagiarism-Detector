import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [texts, setTexts] = useState(["", "", "", "", ""]);
  const [model, setModel] = useState("sentence");
  const [results, setResults] = useState(null);

  // Handle input change
  const updateText = (index, value) => {
    const updated = [...texts];
    updated[index] = value;
    setTexts(updated);
  };

  // Submit texts to backend
  const analyzeTexts = async () => {
    const payload = {
      texts: texts.filter(t => t.trim() !== ""),
      model: model
    };
    const res = await axios.post("http://localhost:8000/analyze", payload);
    setResults(res.data);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>Plagiarism Detector</h2>

      <div>
        <label>
          <input type="radio" value="sentence" checked={model === "sentence"} onChange={() => setModel("sentence")} />
          Sentence Transformer
        </label>
        <label style={{ marginLeft: 20 }}>
          <input type="radio" value="openai" checked={model === "openai"} onChange={() => setModel("openai")} />
          OpenAI
        </label>
        <label style={{ marginLeft: 20 }}>
          <input type="radio" value="gemini" checked={model === "gemini"} onChange={() => setModel("gemini")} />
          Gemini
        </label>
      </div>

      <div>
        {texts.map((text, i) => (
          <textarea
            key={i}
            value={text}
            onChange={(e) => updateText(i, e.target.value)}
            placeholder={`Text ${i + 1}`}
            rows={3}
            style={{ width: "100%", marginTop: 10 }}
          />
        ))}
      </div>

      <button onClick={analyzeTexts} style={{ marginTop: 20 }}>Check Similarity</button>

      {results && (
        <>
          <h3>Similarity Matrix (%)</h3>
          <table border="1" cellPadding="5">
            <tbody>
              <tr>
                <th></th>
                {results.similarity_matrix.map((_, i) => <th key={i}>Text {i+1}</th>)}
              </tr>
              {results.similarity_matrix.map((row, i) => (
                <tr key={i}>
                  <th>Text {i+1}</th>
                  {row.map((value, j) => (
                    <td key={j}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Detected Clones (above 80%)</h3>
          {results.clones.length ? (
            <ul>
              {results.clones.map((pair, i) => (
                <li key={i}>Text {pair[0]+1} & Text {pair[1]+1} → {pair[2]}%</li>
              ))}
            </ul>
          ) : (
            <p>No clones found</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
