use ic_cdk::storage;

#[ic_cdk::init]
fn init() {
    storage::stable_save((0,)).expect("Failed to initialize counter");
}

#[ic_cdk::update]
fn increment() -> i32 {
    let mut count: i32 = storage::stable_restore().unwrap_or((0,)).0;
    count += 1;
    storage::stable_save((count,)).expect("Failed to save counter");
    count
}

#[ic_cdk::update]
fn decrement() -> i32 {
    let mut count: i32 = storage::stable_restore().unwrap_or((0,)).0;
    count -= 1;
    storage::stable_save((count,)).expect("Failed to save counter");
    count
}
