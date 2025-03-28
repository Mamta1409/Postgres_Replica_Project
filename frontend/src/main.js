import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sender || !receiver || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch(`${API_URL}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, receiver, amount: parseFloat(amount) }),
      });
      fetchTransactions();
      setSender("");
      setReceiver("");
      setAmount("");
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Banking Transactions</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="text"
          placeholder="Receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Send Money
        </button>
      </form>
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.sender} → {tx.receiver} : ${tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
