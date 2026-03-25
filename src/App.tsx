import { useState } from "react";

type Source = {
  source: string;
  chunk_id: string;
  text_preview: string;
};

export default function App() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState("");

  const API = "http://localhost:8000";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const form = new FormData();
    Array.from(files).forEach((file) => form.append("files", file));

    setStatus("Uploading...");
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: form
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
  }

  async function sendQuestion() {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await res.json();
    setAnswer(data.answer);
    setSources(data.sources || []);
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Dr. Kaisa</h1>
      <p>Let's chat</p>

      <input type="file" multiple onChange={handleUpload} />
      <p>{status}</p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        style={{ width: "100%", marginTop: 20 }}
        placeholder="Ask something about your research..."
      />

      <button onClick={sendQuestion} style={{ marginTop: 12 }}>
        Ask
      </button>

      <h2>Answer</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{answer}</pre>

      <h2>Sources</h2>
      {sources.map((s) => (
        <div key={s.chunk_id} style={{ marginBottom: 12 }}>
          <strong>{s.source}</strong>
          <div>{s.text_preview}...</div>
        </div>
      ))}
    </div>
  );
}
