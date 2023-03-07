url = 'http://localhost:8000/tasks/';
headersText = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

const showError = (message) => {
  const error = document.getElementById('errors');

  if (!error) {
    return
  }

  error.innerText = message;
}

const getAllTasks = async () => {
  try {
    const response = await fetch (url, {
      method: "GET",
      headers: headersText
    });

    const result = await response.json();
    allTasks = result;
    render();
  } catch(error) {
    showError('Ошибка при загрузке списка задач');
  }
}

const addNewTask = async () => {
  const input = document.getElementById('add-task');

  if (!input.value.trim()) {
    showError('Введите текст');
    return
  }
  try {
    const response = await fetch (url, {
      method: "POST",
      headers: headersText,
      body: JSON.stringify({
        text: input.value.trim()
      })
    });
      const newTask  = await response.json();

      allTasks.push(newTask);
      input.value = '';
      render();
  } catch(error) {
    showError('Ошибка при добавлении задачи');
  }
}

const deleteAllTask = async () => {
    try { 
    const response = await fetch (url, {
      method: "DELETE",
      headers: headersText,
    });
      const resultDelete  = await response.json();

      if (resultDelete.deletedCount !== allTasks.length) {
        showError('Ошибка удаления списка задач на сервере');
        return
      }
      allTasks = [];
      render();
  } catch(error) {
    showError('Ошибка при удалении списка задач');
  }
}

const changeStatusTask = async (id) => {
  const checkbox = document.getElementById(`checkbox-${id}`);
  const index = allTasks.findIndex(task => id === task._id); 
  const urlChangeStatusTask = url + 'checkbox/' + id
  try {
    const response = await fetch (urlChangeStatusTask, {
      method: "PATCH",
      headers: headersText,
      body: JSON.stringify({
        isCheck: checkbox.checked
      })
    });
      const editedCheckbox  = await response.json();
      allTasks[index].isCheck = editedCheckbox.isCheck;
      render();
  } catch(error) {
    showError('Ошибка при изменени статуса задачи');
  }
}

const deleteTask = async (id) => {
  const urlDeleteTask = url + id;
  const index = allTasks.findIndex(task => id === task._id); 
  try { 
    const response = await fetch (urlDeleteTask, {
      method: "DELETE",
      headers: headersText,
    });
    const resultDelete  = await response.json();

    if (resultDelete.deletedCount !== 1) {
      showError('Ошибка удаления задачи на сервере');
      return
    } 

    allTasks.splice(index,1);
    render();
  } catch(error) {
    showError('Ошибка при удалении списка задач');
  }
}

const editTaskText = (id) => {
  const index = allTasks.findIndex(task => id === task._id);
  allTasks[index].isEdit = true;
  render();
}

const applyEditText = async (text, id) => {
  if (!text.trim()) {
    showError('Введите текст');
    return
  }
  const urlApplyEditText = url + 'text/' + id;
  const index = allTasks.findIndex(task => id === task._id);

  try {
    const response = await fetch (urlApplyEditText, {
      method: "PATCH",
      headers: headersText,
      body: JSON.stringify({
        text: text
      })
    });
      const editedText  = await response.json();
      
      if (editedText.text !== text) { 
        showError('Ошибка при редактировании объекта на сервере!');
        return
      } 

      allTasks[index].text = editedText.text;
      allTasks[index].isEdit = false;
      render();
  } catch(error) {
    showError('Ошибка при добавлении задачи');
  }
}

const cancelEditText = (id) => {
  const index = allTasks.findIndex(task => id === task._id);

  allTasks[index].isEdit = false;
  render();
}

const render = () => {
  
  const copyAllTasks = allTasks.slice();
  const content = document.getElementById('content-page');

  showError('');

  if (!content) {
    return
  }
  
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  copyAllTasks.sort((x, y) => x.isCheck >= y.isCheck ? 1 : -1);
  
  copyAllTasks.forEach((task, index) => {
    const {text, isCheck, isEdit, _id: id} = task;
    const conteiner = document.createElement('div');
    const taskCheckbox = document.createElement('input');
    const buttonApplyEditText = document.createElement('button');
    const buttonCancelEditText = document.createElement('button');
    const textTask = document.createElement('p');
    const buttonEditTaskText = document.createElement('button');
    const buttonDeleteTask = document.createElement('button');
    const inputEditTaskText = document.createElement('input');
  
    conteiner.id = `task-${index}`;
    conteiner.classList = 'item-task';
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = isCheck;
    taskCheckbox.className = 'taskCheckbox';
    taskCheckbox.id = `checkbox-${id}`;

    taskCheckbox.onchange = () => {
      changeStatusTask(id);
    }
    if (isEdit) {
      inputEditTaskText.value  = copyAllTasks[index].text;
      buttonApplyEditText.className = 'buttonApplyEditText button-task';
      buttonCancelEditText.className = 'buttonCancelEditText button-task';
      conteiner.append(taskCheckbox);
      conteiner.append(inputEditTaskText);
      conteiner.append(buttonApplyEditText);
      conteiner.append(buttonCancelEditText);
      
      buttonApplyEditText.onclick = () => {
        applyEditText(inputEditTaskText.value, id);
      }
 
      buttonCancelEditText.onclick = () => {
        cancelEditText(id);
      }     
    } else {  
      textTask.innerText = text;
      textTask.className = isCheck ? 'task-text done-text' : 'task-text';
      conteiner.appendChild(taskCheckbox);
      conteiner.appendChild(textTask);
      buttonEditTaskText.className = 'buttonEditTaskText button-task';
      conteiner.appendChild(buttonEditTaskText); 
      buttonDeleteTask.className = 'buttonDeleteTask button-task';
      conteiner.appendChild(buttonDeleteTask); 
      
      buttonDeleteTask.onclick = () => {
        deleteTask(id);
      }
      
      buttonEditTaskText.onclick = () => {
        editTaskText(id);
      }
    } 
    content.appendChild(conteiner);
 
  });
}

window.onload = async function init() {
  await getAllTasks();
}
