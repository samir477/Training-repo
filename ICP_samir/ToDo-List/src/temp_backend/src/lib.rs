use ic_cdk_macros::{query, update};  // Imports query and update macros for ICP.
use std::cell::RefCell;  //it allow safe mutation of the counter in a single-threaded environment.

//To Create a thread-local variable COUNTER and initialized to 0.
thread_local! {
    static COUNTER: RefCell<i32> = RefCell::new(0);
}


//Marks this function as a query method (read-only).
#[query]
fn get_count() -> i32 {
    COUNTER.with(|counter| *counter.borrow())
}

//increment (update) method (modifies state) to increase the value of the counter
#[update]
fn increment() -> i32 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
        *counter.borrow()
    })
}

//decrement (update) method (modifies state) to decrease the value of the counter
#[update]
fn decrement() -> i32 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() -= 1;
        *counter.borrow()
    })
}
