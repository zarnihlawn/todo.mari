const { invoke } = window.__TAURI__.tauri;

async function check_file_exist() {
    await invoke("check_file_exist");
};

check_file_exist();

async function load_data() {
    try {
        let data = await invoke("load_data");
        console.log(data);

        display_all_data(data);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

load_data();

function display_all_data(data) {
  const taskList = document.getElementById('task_list');
  taskList.innerHTML = ''; // clear the list

  data.tasks.slice().reverse().forEach((task) => {
    const taskListItem = document.createElement('li');
    taskListItem.textContent = task.title;

    const statusCircle = document.createElement('span');
    statusCircle.className = 'status-circle';
    console.log(statusCircle);

    if (task.status === false) {
      statusCircle.classList.add('red');
    } else {
      statusCircle.classList.add('green');
    }

    taskListItem.appendChild(statusCircle);
    taskList.appendChild(taskListItem);
  });
}

async function add_data(title) {
    try {
      await invoke("add_data", { invokeMessage: title }); 
    } catch (error) {
      console.log(error);
    }
}

async function delete_data(id) {
    
}


const task_list = document.getElementById('task_list');
const new_task_input = document.getElementById('new_task');
const add_submit_button = document.getElementById('add_submit_button');

add_submit_button.addEventListener('click', (e) => {
    e.preventDefault();
    if (new_task_input.value !== "") {
        const new_task_list = document.createElement('li');
        new_task_list.textContent = new_task_input.value;
        task_list.appendChild(new_task_list);

        add_data(new_task_input.value);

        new_task_input.value = "";

    }

})
