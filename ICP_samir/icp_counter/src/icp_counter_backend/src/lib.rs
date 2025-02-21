use candid::{CandidType, Deserialize};
use ic_cdk_macros::{query, update};
use std::cell::RefCell;

#[derive(CandidType, Deserialize)]
struct Counter {
    value: i32,
}

thread_local! {
    static COUNTER: RefCell<Counter> = RefCell::new(Counter { value: 0 });
}

#[query]
fn get_count() -> i32 {
    COUNTER.with(|c| c.borrow().value)
}

#[update]
fn increment() {
    COUNTER.with(|c| {
        c.borrow_mut().value += 1;
    });
}

#[update]
fn decrement() {
    COUNTER.with(|c| {
        c.borrow_mut().value -= 1;
    });
}
