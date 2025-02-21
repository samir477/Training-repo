import React, { useState, useEffect } from "react";
import { icp_counter_backend } from "../../../declarations/icp_counter_backend";

export default function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchCount();
    }, []);

    async function fetchCount() {
        const value = await icp_counter_backend.get_count();
        setCount(value);
    }

    async function increment() {
        await icp_counter_backend.increment();
        fetchCount();
    }

    async function decrement() {
        await icp_counter_backend.decrement();
        fetchCount();
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ICP Counter</h1>
            <h2>{count}</h2>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}
