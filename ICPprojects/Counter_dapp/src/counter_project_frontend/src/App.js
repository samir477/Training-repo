import { counter_project_backend } from "../../declarations/counter_project_backend";

export async function initCounter() {
    const countElement = document.getElementById("count");
    const incrementBtn = document.getElementById("increment");
    const decrementBtn = document.getElementById("decrement");
    const resetBtn = document.getElementById("reset");

    async function updateCount() {
        const count = await counter_project_backend.get_count();
        countElement.innerText = count;
    }

    incrementBtn.addEventListener("click", async () => {
        await counter_project_backend.increment();
        updateCount();
    });

    decrementBtn.addEventListener("click", async () => {
        await counter_project_backend.decrement();
        updateCount();
    });

    resetBtn.addEventListener("click", async () => {
        await counter_project_backend.reset();
        updateCount();
    });

    // Load count on page load
    updateCount();
}
