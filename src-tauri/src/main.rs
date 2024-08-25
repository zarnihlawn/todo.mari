// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use serde::{Serialize, Deserialize};
use serde_json;
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize)]
struct Task {
    id: u32,
    title: String,
    status: bool,
}

#[derive(Serialize, Deserialize)]
struct Tasks {
    tasks: Vec<Task>,
}

#[tauri::command]
fn check_file_exist() {
    let filename = "data.json";
    let path = Path::new(filename);

    if !path.exists() {
        fs::File::create(filename).expect("Unable to create file");
        let tasks = Tasks { tasks: Vec::new() };
        let json_content = serde_json::to_string_pretty(&tasks).expect("Unable to serialize tasks");
        fs::write(filename, json_content).expect("Unable to write to file");
    } 
}

#[tauri::command]
fn load_data() -> serde_json::Value {
    let filename = "data.json";
    let data = fs::read_to_string(filename).expect("Unable to read file");
    let tasks: Tasks = serde_json::from_str(&data).unwrap();
    serde_json::to_value(tasks).unwrap()
}

#[tauri::command]
fn add_data(invoke_message: String) {
    let filename = "data.json";
    let data = fs::read_to_string(filename).expect("Unable to read file");
    let mut tasks: Tasks = serde_json::from_str(&data).unwrap();

    let new_id = tasks.tasks.len() as u32 + 1;
    let new_task = Task {
        id: new_id,
        title: invoke_message,
        status: false,
    };

    tasks.tasks.push(new_task);

    let json_content = serde_json::to_string_pretty(&tasks).expect("Unable to serialize tasks");
    fs::write(filename, json_content).expect("Unable to write to file");
}

#[tauri::command]
fn edit_status(args: serde_json::Value) -> bool {
    match (args.get("id"), args.get("status")) {
        (Some(id_value), Some(status_value)) => {
            match (id_value.as_u64(), status_value.as_str()) {
                (Some(id), Some(status)) => {
                    let filename = "data.json";
                    let data = fs::read_to_string(filename).expect("Unable to read file");
                    let mut tasks: Tasks = serde_json::from_str(&data).unwrap();

                    for task in &mut tasks.tasks {
                        if task.id as u64 == id {
                            task.status = match status {
                                "red" => false,
                                "green" => true,
                                _ => panic!("Invalid status"),
                            };
                            break;
                        }
                    }

                    let json_content = serde_json::to_string_pretty(&tasks).expect("Unable to serialize tasks");
                    fs::write(filename, json_content).expect("Unable to write to file");

                    true
                }
                _ => false,
            }
        }
        _ => false,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_file_exist, add_data, load_data, edit_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}