const { invoke } = window.__TAURI__.tauri;

async function check_file_exist() {
    await invoke("check_file_exist");
};

check_file_exist();

async function load_data() {
    try {
        let data = await invoke("load_data");
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
    taskListItem.id = task.id; // Set the id attribute

    const statusCircle = document.createElement('span');
    statusCircle.className = 'status-circle';

    if (task.status === false) {
      statusCircle.classList.add('red');
    } else {
      statusCircle.classList.add('green');
    }

    taskListItem.appendChild(statusCircle);
    taskList.appendChild(taskListItem);
  });

  attachStatusCircleEventListeners();
}

async function add_data(title) {
  await invoke("add_data", { invokeMessage: title }); 
  load_data();
}

async function delete_data(id) {

}

async function edit_status(id, status) {
  try {
    await invoke('edit_status', { args: { id, status } });
  } catch (error) {
    console.error(error);
  }
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

const statusCircles = document.getElementsByClassName('status-circle');

function attachStatusCircleEventListeners() {
  const statusCircles = document.getElementsByClassName('status-circle');
  Array.from(statusCircles).forEach((statusCircle) => {
    console.log(`Attached event listener to ${statusCircle}`);
    statusCircle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentColor = statusCircle.classList.contains('red') ? 'red' : 'green';
      const currentId = e.target.parentNode.id;

      const result = edit_status(currentId, currentColor);

      if (result === true) {
        if (currentColor === 'red') {
          statusCircle.classList.remove('red');
          statusCircle.classList.add('green');
        } else {
          statusCircle.classList.remove('green');
          statusCircle.classList.add('red');
        }
      }
      
    });
  });
}