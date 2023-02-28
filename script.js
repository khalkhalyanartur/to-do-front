const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

const addNewTask = () => {
  input = document.getElementById('add-task');

  if (input.value.trim()!='') {
    allTasks.push({
      text: input.value.trim(),
      isCheck: false,
      isEdit: false 
    })
    input.value = '';
    localStorage.setItem('tasks',JSON.stringify(allTasks));
    render();
  }
}

const deleteAllTask = () => {
  allTasks.length = 0;
  localStorage.clear();
  render();
}

const changeStatusTask = (index) => {
  if (!allTasks[index].isEdit) {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks',JSON.stringify(allTasks));
  }
  render();
}

const deleteTask = (index) => {
  allTasks.splice(index,1);
  localStorage.setItem('tasks',JSON.stringify(allTasks));
  render();
}

const editTaskText = (index) => {
  if (!allTasks[index].isCheck) {
    allTasks[index].isEdit = true;
    localStorage.setItem('tasks',JSON.stringify(allTasks));
    render();
  }
}

const applyEditText = (text, index) => {
  allTasks[index].text = text;
  allTasks[index].isEdit = false;
  localStorage.setItem('tasks',JSON.stringify(allTasks));
  render();
}

const cancelEditText = (index) => {
  allTasks[index].isEdit = false;
  localStorage.setItem('tasks',JSON.stringify(allTasks));
  render();
}

const render = () => {
  const copyAllTasks = allTasks.slice();
  const content = document.getElementById('content-page');

  if (!content) {
    return
  }

  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  
  copyAllTasks.sort((x, y) => {
    return Number(x.isCheck) - Number(y.isCheck);
  })

  copyAllTasks.forEach((item, index) => {
    const {text, isCheck, isEdit} = item;
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
    taskCheckbox.onchange = () => {
      changeStatusTask(allTasks.indexOf(item));
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
        applyEditText(inputEditTaskText.value, allTasks.indexOf(item));
      }
 
      buttonCancelEditText.onclick = () => {
        cancelEditText(allTasks.indexOf(item));
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
        deleteTask(allTasks.indexOf(item));
      }
      
      buttonEditTaskText.onclick = () => {
        editTaskText(allTasks.indexOf(item));
      }
    } 
    content.appendChild(conteiner);
 
  });
}

window.onload =  function init() {
  render();
}