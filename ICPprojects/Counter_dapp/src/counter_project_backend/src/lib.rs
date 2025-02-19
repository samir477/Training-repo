use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::{query, update};
use ic_stable_structures::{DefaultMemoryImpl, StableCell, Storable};
use std::cell::RefCell;

const INIT_VALUE: u64 = 0;

// Define memory and storage
thread_local! {
    static COUNTER: RefCell<StableCell<u64, DefaultMemoryImpl>> = RefCell::new(
        StableCell::init(DefaultMemoryImpl::default(), INIT_VALUE)
            .expect("Failed to initialize stable storage")
    );
}

// Increment Counter
#[update]
fn increment() {
    COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        let new_value = counter.get().saturating_add(1);
        counter.set(new_value).expect("Failed to increment counter");
    });
}

// Decrement Counter
#[update]
fn decrement() {
    COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        let new_value = counter.get().saturating_sub(1);
        counter.set(new_value).expect("Failed to decrement counter");
    });
}

// Get Current Counter Value
#[query]
fn get_count() -> i32 {
    COUNTER.with(|counter| {
        (*counter.borrow().get())
            .try_into()
            .expect("Counter value exceeds i32 range")
    })
}

// Reset Counter
#[update]
fn reset() {
    COUNTER.with(|counter| {
        counter
            .borrow_mut()
            .set(INIT_VALUE)
            .expect("Failed to reset counter");
    });
}
