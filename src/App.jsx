import { useState, useEffect } from "react";

function App() {
  const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password);

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [protectedData, setProtectedData] = useState(null);
  const [message, setMessage] = useState("");

  // Poll state
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);

  // Auth functions
  const register = async () => {
    try {
      const res = await fetch("https://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setMessage("Registered successfully!");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async () => {
    try {
      const res = await fetch("https://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setMessage("Logged in successfully!");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProtectedData = async () => {
    try {
      const res = await fetch("https://localhost:5000/api/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProtectedData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Poll functions
  const fetchPolls = async () => {
    const res = await fetch("https://localhost:5000/api/polls");
    const data = await res.json();
    setPolls(data);
  };

  const createPoll = async () => {
    if (!token) return alert("Login first!");
    const res = await fetch("https://localhost:5000/api/polls", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ question, options })
    });
    await res.json();
    fetchPolls(); // refresh
    setQuestion("");
    setOptions(["", "", ""]);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to PulseVote</h2>

      {/* Auth */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ margin: "1rem 0" }}>
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>

      <button onClick={getProtectedData} disabled={!token}>
        Get Protected Data
      </button>

      <p>{message}</p>
      {protectedData && <pre>{JSON.stringify(protectedData, null, 2)}</pre>}

      {/* Poll creation */}
      <h3>Create Poll</h3>
      <input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
      {options.map((opt, i) => (
        <input key={i} placeholder={`Option ${i+1}`} value={options[i]} onChange={e => {
          const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts);
        }} />
      ))}
      <button onClick={createPoll}>Create Poll</button>

      {/* Poll list */}
      <h3>Polls</h3>
      {polls.map(p => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: "0.5rem", padding: "0.5rem" }}>
          <strong>{p.question}</strong>
          {p.options.map((o, i) => (
            <div key={i}>
              {o.text} ({o.votes})
              <button onClick={async () => {
                await fetch("https://localhost:5000/api/polls/vote", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ pollId: p._id, optionIndex: i })
                });
                fetchPolls();
              }}>Vote</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
await fetch("https://localhost:5000/api/polls/vote", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ pollId: p._id, optionIndex: i })
});
