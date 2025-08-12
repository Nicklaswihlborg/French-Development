/* global React, ReactDOM */
const { useState, useEffect } = React;

function App() {
  const [micStatus, setMicStatus] = useState('checking…');
  const [note, setNote] = useState('Bienvenue !');

  // Check microphone capability/permission
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicStatus('unsupported');
      return;
    }
    // Try Permissions API (not in all browsers)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(res => {
        setMicStatus(res.state); // 'granted' | 'denied' | 'prompt'
        res.onchange = () => setMicStatus(res.state);
      }).catch(() => setMicStatus('unknown'));
    } else {
      setMicStatus('unknown');
    }
  }, []);

  async function testMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop to release the mic
      stream.getTracks().forEach(t => t.stop());
      setMicStatus('granted');
      setNote('Micro OK ✅');
    } catch (err) {
      setMicStatus('blocked');
      setNote('Erreur micro : permission refusée ❌');
    }
  }

  return (
    <div style={{
      maxWidth: 960, margin: '24px auto', padding: 20,
      background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 16, fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif'
    }}>
      <h1>🇫🇷 French Development</h1>
      <p>Statut du micro : <strong>{micStatus}</strong></p>
      <button onClick={testMic} style={{
        padding: '10px 14px', border: 'none', borderRadius: 8, cursor: 'pointer'
      }}>Tester le micro</button>
      <p style={{opacity:.9, marginTop:12}}>{note}</p>
      <hr style={{opacity:.2}}/>
      <p style={{opacity:.8}}>Si la page reste vide, vérifie la console (F12) pour les erreurs.</p>
    </div>
  );
}

// Mount using React 18 globals loaded by index.html
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
