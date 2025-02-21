import { useState } from "react";
import { counter_backend } from "declarations/counter_backend";

function App() {
  const [counter, setCounter] = useState(0);

  async function incrementCounter() {
    const newCounter = await counter_backend.increment();
    setCounter(Number(newCounter)); 
  }

  async function decrementCounter() {
    const newCounter = await counter_backend.decrement();
    setCounter(Number(newCounter)); 
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <h2>Counter : {counter}</h2>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
    </main>
  );
}

export default App;