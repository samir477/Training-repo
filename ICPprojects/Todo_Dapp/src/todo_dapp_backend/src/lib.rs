use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{init, query, update, pre_upgrade, post_upgrade, storage};
use std::cell::RefCell;
use std::collections::HashMap;

// ✅ Task structure
#[derive(CandidType, Deserialize, Clone, Debug)]
struct Task {
    id: u32, // ✅ Ensuring ID is included
    description: String,
    completed: bool,
    important: bool,
}

// ✅ Main ToDo struct (stores tasks per user)
#[derive(CandidType, Deserialize, Clone, Default, Debug)]
struct TodoApp {
    tasks: HashMap<Principal, HashMap<u32, Task>>, // Maps each user to their tasks
    next_task_id: HashMap<Principal, u32>, // Tracks the next task ID per user
}

// ✅ Global state
thread_local! {
    static TODO_APP: RefCell<TodoApp> = RefCell::new(TodoApp::default());
}

// ✅ Save data before upgrade
#[pre_upgrade]
fn pre_upgrade() {
    TODO_APP.with(|app| {
        storage::stable_save((&*app.borrow(),)).expect("Failed to save state");
    });
}

// ✅ Load data after upgrade
#[post_upgrade]
fn post_upgrade() {
    let (app,): (TodoApp,) = storage::stable_restore().unwrap_or_default();
    TODO_APP.with(|state| {
        *state.borrow_mut() = app;
    });
}

// ✅ Add Task and return its ID
#[update]
fn add_task(description: String) -> u32 {
    let caller = ic_cdk::caller();
    let new_id = TODO_APP.with(|app| {
        let mut app_mut = app.borrow_mut();
        let task_id = app_mut.next_task_id.entry(caller).or_insert(1);
        let new_id = *task_id;
        *task_id += 1;
        new_id
    });

    TODO_APP.with(|app| {
        let mut app_mut = app.borrow_mut();
        app_mut.tasks.entry(caller).or_default().insert(
            new_id,
            Task {
                id: new_id, // ✅ Ensure ID is included
                description,
                completed: false,
                important: false,
            },
        );
    });

    new_id
}

// ✅ Get all tasks (Fixes missing ID issue)
#[query]
fn get_tasks() -> Vec<Task> {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        app.borrow()
            .tasks
            .get(&caller)
            .map(|tasks| tasks.values().cloned().collect())
            .unwrap_or_default()
    })
}

// ✅ Mark task as completed
#[update]
fn mark_task_completed(id: u32) -> Result<(), String> {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        let mut app = app.borrow_mut();
        if let Some(user_tasks) = app.tasks.get_mut(&caller) {
            if let Some(task) = user_tasks.get_mut(&id) {
                task.completed = true;
                return Ok(());
            }
        }
        Err("Task not found".to_string())
    })
}

// ✅ Mark task as important
#[update]
fn mark_task_important(id: u32) -> Result<(), String> {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        let mut app = app.borrow_mut();
        if let Some(user_tasks) = app.tasks.get_mut(&caller) {
            if let Some(task) = user_tasks.get_mut(&id) {
                task.important = true;
                return Ok(());
            }
        }
        Err("Task not found".to_string())
    })
}

// ✅ Remove task
#[update]
fn remove_task(id: u32) -> Result<(), String> {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        let mut app = app.borrow_mut();
        if let Some(user_tasks) = app.tasks.get_mut(&caller) {
            if user_tasks.remove(&id).is_some() {
                // If all tasks are removed, reset `next_task_id`
                if user_tasks.is_empty() {
                    app.next_task_id.insert(caller, 1);
                }
                return Ok(());
            }
        }
        Err("Task not found".to_string())
    })
}

// ✅ Count completed tasks
#[query]
fn count_completed_tasks() -> u32 {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        app.borrow()
            .tasks
            .get(&caller)
            .map(|tasks| tasks.values().filter(|task| task.completed).count() as u32)
            .unwrap_or(0)
    })
}

// ✅ Count pending tasks
#[query]
fn count_pending_tasks() -> u32 {
    let caller = ic_cdk::caller();
    TODO_APP.with(|app| {
        app.borrow()
            .tasks
            .get(&caller)
            .map(|tasks| tasks.values().filter(|task| !task.completed).count() as u32)
            .unwrap_or(0)
    })
}

// ✅ Debug function (View state)
#[query]
fn debug_get_state() -> String {
    TODO_APP.with(|app| format!("{:#?}", *app.borrow()))
}

// ✅ Export Candid Interface
use candid::export_service;

#[query]
fn get_candid_interface() -> String {
    export_service!();
    __export_service()
}
