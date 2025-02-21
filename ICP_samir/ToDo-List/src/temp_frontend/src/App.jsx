import React, { useState, useEffect } from "react";
import { temp_backend } from "../../declarations/temp_backend";
import "../style.css"; // Import the external CSS file

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, []);

  async function fetchCount() {
    try {
      const value = await temp_backend.get_count();
      setCount(value);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  }

  async function increment() {
    try {
      const newValue = await temp_backend.increment();
      setCount(newValue);
    } catch (error) {
      console.error("Error incrementing:", error);
    }
  }

  async function decrement() {
    try {
      const newValue = await temp_backend.decrement();
      setCount(newValue);
    } catch (error) {
      console.error("Error decrementing:", error);
    }
  }

  return (
    <div className="container">
      <div className="counter-box">
        <h1>ICP Counter</h1>
        <p className="counter-number">{count}</p>
        <div className="button-group">
          <button className="button decrement" onClick={decrement}>-</button>
          <button className="button increment" onClick={increment}>+</button>
        </div>
      </div>
    </div>
  );
}
