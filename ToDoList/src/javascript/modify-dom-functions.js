import { addDays } from "date-fns";
import {
  getAllTasks,
  getTaskByDate,
  saveAllTasks,
  getAllProjects,
  getProjectById,
  getCompletedTask,
  getTaskByPriority,
  getTaskById,
  getTaskByProjectId,
  getAllLabels,
  saveAllLabels,
  saveAllProjects,
} from "./data-api";
import {
  resetShowTask,
  resetProjectMenu,
  taskTemplate,
  dialogTaskTemplate,
  checkDate,
  saveNewTask,
  saveChangeTask,
  oldProjectOfTask,
  taskFactoryFunction,
  projectFactoryFunction,
  disableScroll,
  enableScroll,
  removeProjectFromAllTasks,
} from "./utilites";

////
//// GLOBAL VARIABLE
////

const allProjects = getAllProjects();
const allTasks = getAllTasks();
const allLabels = getAllLabels();

////
////  MAIN MENU
////

const taskContainer = document.querySelector("#list-tasks-container");
const taskContentTitle = document.querySelector(".list-tasks-section > header >.title > h1");

const showAllTaskButton = document.querySelector("#show-all-task");
const showTodayTaskButton = document.querySelector("#show-today-task");
const showTodayTaskIn7DayButton = document.querySelector("#show-task-in-7-day");
const showImportantTaskButton = document.querySelector("#show-important-task");
const showCompleteTaskButton = document.querySelector("#show-completed-task");

// When click on task
function onClickTaskLi(task) {
  boxTaskEditor.style.display = "none";
  addTaskButton.style.display = "block";
  dialogTaskEditor.style.display = "block";
  dialogTaskEditor.style.zIndex = 2;
  popupOverlay.style.zIndex = 1;

  dialogTaskTemplate = taskFactoryFunction(...Object.values(task.getAll()));
  oldProjectOfTask = dialogTaskTemplate.getAll().project;

  document.querySelector("#dialog-editor-task-title").value = dialogTaskTemplate.getAll().title;

  document.querySelector("#dialog-editor-task-description").style.height = 0;
  document.querySelector("#dialog-editor-task-description").value =
    dialogTaskTemplate.getAll().description;
  document.querySelector("#dialog-editor-task-description").style.height =
    document.querySelector("#dialog-editor-task-description").scrollHeight + "px";

  document.querySelector(".dialog-task-editor .task-due-date input").value =
    dialogTaskTemplate.getAll().dueDate;
  document.querySelector(".dialog-task-editor .task-due-date span").textContent = checkDate(
    new Date(dialogTaskTemplate.getAll().dueDate),
  );

  dialogTaskPriorityButton.classList.remove("priority-1", "priority-2", "priority-3", "priority-4");
  dialogTaskPriorityButton.classList.add("priority-" + dialogTaskTemplate.getAll().priority);

  document.querySelector("#save-dialog-editor-button").textContent = "Save Change";
}

function showTasks(tasks, title, complete = false) {
  taskContainer.innerHTML = "";
  taskContentTitle.textContent = title;

  if (tasks && tasks.length > 0) {
    const ul = document.createElement("ul");
    for (let taskObj of tasks) {
      if (!complete && taskObj.getAll().complete) continue;

      const task = taskObj.getAll();
      const li = document.createElement("li");
      li.id = "task-" + task.id;
      li.innerHTML = `<input type="checkbox" class="complete-checkbox-button">
                      <h4>${task.title}</h4>
                      <p>${task.description}</p>
                      <div class="group-features">
                        <button id="delete-task-button-${task.id}" class="icon-button small-icon delete-task-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                          </svg>
                        </button>
                      </div>`;
      // const editTaskButton = li.querySelector(".edit-button");
      // const commentButton = li.querySelector(".comment-button");
      const deleteTaskButton = li.querySelector(".delete-task-button");

      li.querySelector("input").addEventListener("click", (e) => {
        e.stopPropagation();
      });

      li.querySelector(".group-features").addEventListener("click", (e) => {
        e.stopPropagation();
      });

      addEventTaskStatusChange(li.querySelector(".complete-checkbox-button"), taskObj);

      deleteTaskButton.addEventListener("click", (e) => {
        const buttonId = e.currentTarget.id.match(/[0-9]*$/);
        const index = allTasks.findIndex((task) => {
          return +task.getAll().id === +buttonId[0];
        });

        if (index >= 0) {
          allTasks.splice(index, 1);
          saveAllTasks(allTasks);
          li.parentNode.removeChild(li);
        }
      });

      li.addEventListener("click", (e) => {
        onClickTaskLi(taskObj);
      });

      ul.appendChild(li);
    }

    taskContainer.appendChild(ul);
  }
}

function showAllTask() {
  showTasks(getAllTasks(), "All Task", true);
}

function showTodayTask() {
  const todayTasks = getTaskByDate(new Date());
  showTasks(todayTasks, "Today");
}

function showTaskIn7Day() {
  const taskIn7Day = getTaskByDate(new Date(), addDays(new Date(), 7));
  showTasks(taskIn7Day, "In 7 Days");
}

function showImportantTask() {
  const importantTask = getTaskByPriority(1);
  showTasks(importantTask, "Important Tasks");
}

function showCompleteTask() {
  const completeTask = getCompletedTask();
  showTasks(completeTask, "Complete Tasks", true);
}

function showTasksInProject(projectTitle, projectId) {
  const tasksInProject = getTaskByProjectId(projectId);
  showTasks(tasksInProject, projectTitle, true);
}

showAllTaskButton.addEventListener("click", () => {
  resetShowTask = showAllTask;
  showAllTask();
});

showTodayTaskButton.addEventListener("click", () => {
  resetShowTask = showTodayTask;
  showTodayTask();
});

showTodayTaskIn7DayButton.addEventListener("click", () => {
  resetShowTask = showTaskIn7Day;
  showTaskIn7Day();
});

showImportantTaskButton.addEventListener("click", () => {
  resetShowTask = showImportantTask;
  showImportantTask();
});

showCompleteTaskButton.addEventListener("click", () => {
  resetShowTask = showCompleteTask;
  showCompleteTask();
});

////
//// PROJECT MENU
////

const projectContainer = document.querySelector("#menu-project-container");
const projectList = projectContainer.querySelector("#project-list");
const showNewProjectDialog = projectContainer.querySelector("#show-new-project-dialog");
const newProjectDialog = document.querySelector(".new-project-dialog");
const cancelProjectDialogButton = newProjectDialog.querySelector(".cancel-new-project");
const addNewProjectButton = newProjectDialog.querySelector(".add-new-project");

function createTaskElementInProjectMenu(index, ul) {
  for (let taskId of allProjects[index].getAll().tasks) {
    const task = getTaskById(taskId);

    if (task) {
      const li = document.createElement("li");
      li.textContent = task.getAll().title;
      li.addEventListener("click", (e) => {
        onClickTaskLi(task);
      });
      ul.appendChild(li);
    }
  }
}

function createProjectElementMenu() {
  projectList.innerHTML = "";

  for (let i = 0; i < allProjects.length; i++) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const ul = document.createElement("ul");

    details.classList.add("project");

    details.addEventListener("click", (e) => {
      resetShowTask = function () {
        showTasksInProject(allProjects[i].getAll().title, allProjects[i].getAll().id);
      };
      showTasksInProject(allProjects[i].getAll().title, allProjects[i].getAll().id);

      const projectList = document.querySelectorAll(".project");
      for (let j = 0; j < projectList.length; j++) {
        if (projectList[j] !== details) projectList[j].removeAttribute("open");
      }
    });

    createTaskElementInProjectMenu(i, ul);

    summary.innerHTML = `
      <span>${allProjects[i].getAll().title}</span>
      <div class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>`;

    summary.querySelector(".icon-button").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeProjectFromAllTasks(allProjects[i].getAll().id, allTasks);
      allProjects.splice(i, 1);
      saveAllProjects(allProjects);
      saveAllTasks(allTasks);
      location.reload();
    });

    details.appendChild(ul);
    details.appendChild(summary);
    projectList.appendChild(details);
  }
}

showNewProjectDialog.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  boxTaskEditor.style.display = "none";
  addTaskButton.style.display = "block";

  newProjectDialog.style.display = "block";
  newProjectDialog.style.zIndex = 2;
  popupOverlay.style.zIndex = 1;
});

cancelProjectDialogButton.addEventListener("click", (e) => {
  newProjectDialog.style.display = "none";
  popupOverlay.style.zIndex = -9999;
});

addNewProjectButton.addEventListener("click", (e) => {
  const projectName = newProjectDialog.querySelector("#new-project-name").value;
  const projectColor = newProjectDialog.querySelector("#new-project-color").value;

  allProjects.push(
    projectFactoryFunction(allProjects[allProjects.length - 1].getAll().id + 1, projectName),
  );
  saveAllProjects(allProjects);
  location.reload();
});

////
//// POPUP OVERLEY
////

const popupOverlay = document.querySelector(".popup-overlay");
const subPopupOverlay = document.querySelector(".sub-popup-overlay");

window.addEventListener("scroll", (e) => {
  if (subPopupOverlay.style.zIndex != -9999) subPopupOverlay.click();
});

popupOverlay.addEventListener("click", () => {
  if (dialogTaskEditor.style.display === "block") {
    cancelEditor(
      dialogTaskEditor,
      dialogTaskPriorityButton,
      dialogTaskDueDateButton,
      dialogTaskTemplate,
    );
  }
  if (newProjectDialog.style.display === "block") {
    newProjectDialog.style.display = "none";
  }
  popupOverlay.style.zIndex = -9999;
});

subPopupOverlay.addEventListener("click", () => {
  subPopupOverlay.style.zIndex = -9999;
  enableScroll();

  if (document.querySelector(".task-label-list")) {
    document
      .querySelector(".task-label-list")
      .parentNode.removeChild(document.querySelector(".task-label-list"));
  }
  if (document.querySelector(".task-priority-list")) {
    document
      .querySelector(".task-priority-list")
      .parentNode.removeChild(document.querySelector(".task-priority-list"));
  }
  if (document.querySelector(".project-list")) {
    document
      .querySelector(".project-list")
      .parentNode.removeChild(document.querySelector(".project-list"));
  }
});

////
////  LIST TASK CONTAINER
////

const boxTaskEditor = document.querySelector(".box-task-editor");
const datePicker = document.querySelector(".box-task-editor .date-picker");
const taskDueDateButton = document.querySelector(".box-task-editor .task-due-date");
const taskLabelButton = document.querySelector(".box-task-editor .task-label");
const taskPriorityButton = document.querySelector(".box-task-editor .task-priority");
const boxTaskProjectButton = document.querySelector(".box-task-editor .project-contain-task");

const mainAddTaskButton = document.querySelector(".main-add-task-button");
const addTaskButton = document.querySelector(".add-task-button");

const saveBoxEditorButton = document.querySelector("#save-box-editor-button");
const cancelBoxEditorButton = document.querySelector("#cancel-box-editor-button");
const saveDialogEditorButton = document.querySelector("#save-dialog-editor-button");
const cancelDialogEditorButton = document.querySelector("#cancel-dialog-editor-button");

const dialogTaskEditor = document.querySelector(".dialog-task-editor");
const dialogDatePicker = document.querySelector(".dialog-task-editor .date-picker");
const dialogTaskDueDateButton = document.querySelector(".dialog-task-editor .task-due-date");
const dialogTaskLabelButton = document.querySelector(".dialog-task-editor .task-label");
const dialogTaskPriorityButton = document.querySelector(".dialog-task-editor .task-priority");
const dialogProjectButton = document.querySelector(".dialog-task-editor .project-contain-task");

// When change task status complete/not complete
function addEventTaskStatusChange(inputElement, task) {
  inputElement.checked = task.getAll().complete;
  inputElement.addEventListener("change", (e) => {
    task.setComplete(e.currentTarget.checked);
    saveAllTasks(allTasks);
  });
}

//// BOX EDITOR

document.querySelector("#box-editor-task-title").addEventListener("input", (e) => {
  taskTemplate.setTitle(e.target.value);
});
document.querySelector("#box-editor-task-description").addEventListener("input", (e) => {
  taskTemplate.setDescription(e.target.value);
});

// Show date picker when click on calendaer button
taskDueDateButton.addEventListener("click", (e) => {
  datePicker.showPicker();
});

// Change task due date text after modify
function changeTaskTemplateDate(button, datePicker, taskTemplate) {
  button.querySelector("span").textContent = checkDate(new Date(datePicker.value));
  taskTemplate.setDueDate(datePicker.value);
}

datePicker.addEventListener("change", () => {
  changeTaskTemplateDate(taskDueDateButton, datePicker, taskTemplate);
});

// Init before show popup
function initBeforeShowPopup(buttonTrigger, classOfListContainer) {
  const listContainer = document.createElement("div");

  subPopupOverlay.style.zIndex = 1;

  listContainer.style.top =
    buttonTrigger.getBoundingClientRect().y + buttonTrigger.getBoundingClientRect().height + "px";
  listContainer.style.left = buttonTrigger.getBoundingClientRect().x + "px";
  listContainer.classList.add(classOfListContainer);
  listContainer.style.zIndex = 2;

  listContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  disableScroll();

  return listContainer;
}

function createCheckBoxOrRadioButton(type, name, id, value, checked) {
  const input = document.createElement("input");

  input.type = type;
  input.name = name;
  input.id = id;
  input.value = value;
  input.checked = checked;

  return input;
}

// Create label element
function createDefaultLabelElement(taskTemplate, labelArr, i, checked = false) {
  const li = document.createElement("li");
  const checkbox = createCheckBoxOrRadioButton(
    "checkbox",
    "task-label-" + (i + 1),
    "label-" + (i + 1),
    labelArr[i],
    checked,
  );

  checkbox.addEventListener("click", (e) => {
    if (checkbox.checked) taskTemplate.addLabel(checkbox.value);
    else {
      taskTemplate.removeLabel(checkbox.value);
    }
  });

  const label = document.createElement("label");
  label.setAttribute("for", "label-" + (i + 1));
  label.textContent = labelArr[i];

  li.appendChild(label);
  li.appendChild(checkbox);

  return li;
}

// Create add new label button
function createAddNewLabelButton(ul, taskTemplate, input) {
  const addNewLabelButton = document.createElement("button");
  const span = document.createElement("span");

  span.textContent = "Create " + input.textContent;
  span.style.width = "100%";
  span.style.textAlign = "center";

  addNewLabelButton.appendChild(span);
  addNewLabelButton.style.width = "100%";
  addNewLabelButton.id = "add-new-label-button";
  addNewLabelButton.classList.add("icon-button", "small-icon");
  addNewLabelButton.addEventListener("click", () => {
    allLabels.push(input.value);
    saveAllLabels(allLabels);
    ul.appendChild(createDefaultLabelElement(taskTemplate, allLabels, allLabels.length - 1, true));
    document
      .querySelector("#add-new-label-button")
      .parentNode.removeChild(document.querySelector("#add-new-label-button"));
    taskTemplate.addLabel(input.value);
  });

  return addNewLabelButton;
}

// Show task label
taskLabelButton.addEventListener("click", () => {
  if (!document.querySelector(".task-label-list")) {
    const taskLabeList = initBeforeShowPopup(taskLabelButton, "task-label-list");
    const input = document.createElement("input");
    const ul = document.createElement("ul");
    const labelsSelected = taskTemplate.getAll().labels;

    input.type = "text";
    input.placeholder = "Type a label";

    for (let i = 0; i < allLabels.length; i++) {
      if (labelsSelected.filter((label) => allLabels[i] === label).length) {
        ul.appendChild(createDefaultLabelElement(taskTemplate, allLabels, i, true));
      } else {
        ul.appendChild(createDefaultLabelElement(taskTemplate, allLabels, i));
      }
    }

    input.addEventListener("input", () => {
      if (input.value === "") {
        for (let i = 0; i < ul.childNodes.length; i++) {
          ul.childNodes[i].style.display = "flex";
        }
      } else {
        const searchLabelArr = allLabels.map((label) =>
          label.includes(input.value) ? true : false,
        );

        for (let i = 0; i < ul.childNodes.length; i++) {
          if (!searchLabelArr[i]) ul.childNodes[i].style.display = "none";
          else ul.childNodes[i].style.display = "flex";
        }

        const checkSameLabel = allLabels.filter((label) => label === input.value);
        if (checkSameLabel.length) {
          const addNewLabelButton = document.querySelector("#add-new-label-button");
          if (addNewLabelButton) {
            addNewLabelButton.parentNode.removeChild(addNewLabelButton);
          }
        } else if (!document.querySelector("#add-new-label-button")) {
          const addNewLabelButton = createAddNewLabelButton(ul, taskTemplate, input);
          taskLabeList.appendChild(addNewLabelButton);
        }
      }
    });

    taskLabeList.appendChild(input);
    taskLabeList.appendChild(ul);
    subPopupOverlay.appendChild(taskLabeList);
    input.focus();
  }
});

// Create priority element
function createPriorityElement(taskTemplate, taskPriorityButton, i, checked = false) {
  const li = document.createElement("li");
  const radio = createCheckBoxOrRadioButton("radio", "task-priority", "priority-" + i, i, checked);

  li.classList.add("task-priority", "priority-" + i);

  radio.addEventListener("click", (e) => {
    if (radio.checked) {
      taskTemplate.setPriority(radio.value);
      taskPriorityButton.classList.remove("priority-1", "priority-2", "priority-3", "priority-4");
      taskPriorityButton.classList.add("priority-" + i);
    }
  });

  const label = document.createElement("label");
  label.setAttribute("for", "priority-" + i);
  label.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="inherit" class="bi bi-flag-fill" viewBox="0 0 16 16">
                      <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                    </svg><span>Priority ${i}</span>`;

  li.appendChild(label);
  li.appendChild(radio);

  return li;
}

// Show task priority
taskPriorityButton.addEventListener("click", () => {
  if (!document.querySelector(".task-priority-list")) {
    const taskPriorityList = initBeforeShowPopup(taskPriorityButton, "task-priority-list");

    const ul = document.createElement("ul");
    const prioritySelected = taskTemplate.getAll().priority;

    for (let i = 1; i <= 4; i++) {
      ul.appendChild(
        createPriorityElement(taskTemplate, taskPriorityButton, i, +prioritySelected === +i),
      );
    }

    taskPriorityList.appendChild(ul);
    subPopupOverlay.appendChild(taskPriorityList);
  }
});

// Create project element
function createProjectElement(taskTemplate, projectId, projectTitle, checked = false) {
  const li = document.createElement("li");
  const radio = createCheckBoxOrRadioButton(
    "radio",
    "project",
    "project-" + projectId,
    projectId,
    checked,
  );

  radio.addEventListener("click", (e) => {
    if (radio.checked) taskTemplate.setProject(radio.value);
  });

  const label = document.createElement("label");
  label.setAttribute("for", "project-" + projectId);
  label.textContent = projectTitle;

  li.appendChild(label);
  li.appendChild(radio);

  return li;
}

// Show project
boxTaskProjectButton.addEventListener("click", () => {
  if (!document.querySelector(".project-list")) {
    const projectList = initBeforeShowPopup(boxTaskProjectButton, "project-list");
    const ul = document.createElement("ul");
    const projectSelected = taskTemplate.getAll().project;

    for (let i = 0; i < allProjects.length; i++) {
      const project = allProjects[i].getAll();
      ul.appendChild(
        createProjectElement(
          taskTemplate,
          project.id,
          project.title,
          +projectSelected === +project.id,
        ),
      );
    }

    projectList.appendChild(ul);
    subPopupOverlay.appendChild(projectList);
  }
});

// Save task button in box task editor
saveBoxEditorButton.addEventListener("click", () => {
  if (taskTemplate.checkValid()) {
    saveNewTask(taskTemplate, allTasks, allProjects);

    cancelEditor(boxTaskEditor, taskPriorityButton, taskDueDateButton, taskTemplate, addTaskButton);

    resetShowTask();
    resetProjectMenu();
  }
});

cancelBoxEditorButton.addEventListener("click", () => {
  cancelEditor(boxTaskEditor, taskPriorityButton, taskDueDateButton, taskTemplate, addTaskButton);
});

// Show box task editor when click on add task button
addTaskButton.addEventListener("click", () => {
  boxTaskEditor.style.display = "block";
  addTaskButton.style.display = "none";
});

// Reset element to default
function cancelEditor(
  taskEditor,
  taskPriorityButton,
  taskDueDateButton,
  taskTemplate,
  addTaskButton,
) {
  taskEditor.style.display = "none";
  taskEditor.querySelector(".editor-task-title").value = "";
  taskEditor.querySelector("textarea").value = "";
  taskEditor.querySelector("#hidden-date-input").value = "";

  taskPriorityButton.classList.remove("priority-1", "priority-2", "priority-3", "priority-4");
  taskPriorityButton.classList.add("priority-4");
  taskDueDateButton.querySelector("span").textContent = "Calendar";

  taskTemplate.reset();

  popupOverlay.style.zIndex = -9999;
  if (addTaskButton) addTaskButton.style.display = "block";
}

//// DIALOG EDITOR
document.querySelector("#dialog-editor-task-title").addEventListener("input", (e) => {
  dialogTaskTemplate.setTitle(e.target.value);
});
document.querySelector("#dialog-editor-task-description").addEventListener("input", (e) => {
  dialogTaskTemplate.setDescription(e.target.value);
});

function initBeforeShowDialogPopup(buttonTrigger, classOfListContainer) {
  const listContainer = document.createElement("div");

  subPopupOverlay.style.zIndex = 2;

  listContainer.classList.add(classOfListContainer);

  listContainer.style.top =
    buttonTrigger.getBoundingClientRect().y + buttonTrigger.getBoundingClientRect().height + "px";
  listContainer.style.left = buttonTrigger.getBoundingClientRect().x + "px";

  listContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  return listContainer;
}

dialogTaskDueDateButton.addEventListener("click", (e) => {
  dialogDatePicker.showPicker();
});

dialogDatePicker.addEventListener("change", () => {
  changeTaskTemplateDate(dialogTaskDueDateButton, dialogDatePicker, dialogTaskTemplate);
});

dialogTaskLabelButton.addEventListener("click", () => {
  if (!dialogTaskEditor.querySelector(".task-label-list")) {
    const taskLabeList = initBeforeShowDialogPopup(dialogTaskLabelButton, "task-label-list");
    const input = document.createElement("input");
    const ul = document.createElement("ul");
    const labelsSelected = dialogTaskTemplate.getAll().labels;

    input.type = "text";
    input.placeholder = "Type a label";

    for (let i = 0; i < allLabels.length; i++) {
      if (labelsSelected.filter((label) => allLabels[i] === label).length) {
        ul.appendChild(createDefaultLabelElement(dialogTaskTemplate, allLabels, i, true));
      } else {
        ul.appendChild(createDefaultLabelElement(dialogTaskTemplate, allLabels, i));
      }
    }

    input.addEventListener("input", () => {
      if (input.value === "") {
        for (let i = 0; i < ul.childNodes.length; i++) {
          ul.childNodes[i].style.display = "flex";
        }
      } else {
        const searchLabelArr = allLabels.map((label) =>
          label.includes(input.value) ? true : false,
        );
        for (let i = 0; i < ul.childNodes.length; i++) {
          if (!searchLabelArr[i]) ul.childNodes[i].style.display = "none";
          else ul.childNodes[i].style.display = "flex";
        }

        const checkSameLabel = allLabels.filter((label) => label === input.value);
        if (checkSameLabel.length) {
          const addNewLabelButton = document.querySelector("#add-new-label-button");
          if (addNewLabelButton) {
            addNewLabelButton.parentNode.removeChild(addNewLabelButton);
          }
        } else if (!document.querySelector("#add-new-label-button")) {
          const addNewLabelButton = createAddNewLabelButton(ul, dialogTaskTemplate, input);
          taskLabeList.appendChild(addNewLabelButton);
        }
      }
    });

    taskLabeList.appendChild(input);
    taskLabeList.appendChild(ul);
    subPopupOverlay.appendChild(taskLabeList);
    input.focus();
  }
});

dialogTaskPriorityButton.addEventListener("click", () => {
  if (!document.querySelector(".task-priority-list")) {
    const taskPriorityList = initBeforeShowDialogPopup(
      dialogTaskPriorityButton,
      "task-priority-list",
    );
    const ul = document.createElement("ul");
    const prioritySelected = dialogTaskTemplate.getAll().priority;

    for (let i = 1; i <= 4; i++) {
      ul.appendChild(
        createPriorityElement(
          dialogTaskTemplate,
          dialogTaskPriorityButton,
          i,
          +prioritySelected === +i,
        ),
      );
    }

    taskPriorityList.appendChild(ul);
    subPopupOverlay.appendChild(taskPriorityList);
  }
});

dialogProjectButton.addEventListener("click", () => {
  if (!document.querySelector(".project-list")) {
    const projectList = initBeforeShowDialogPopup(dialogProjectButton, "project-list");
    const ul = document.createElement("ul");
    const projectSelected = dialogTaskTemplate.getAll().project;

    for (let i = 0; i < allProjects.length; i++) {
      const project = allProjects[i].getAll();

      ul.appendChild(
        createProjectElement(
          dialogTaskTemplate,
          project.id,
          project.title,
          +projectSelected === +project.id,
        ),
      );
    }

    projectList.appendChild(ul);
    subPopupOverlay.appendChild(projectList);
  }
});

cancelDialogEditorButton.addEventListener("click", (e) => {
  cancelEditor(
    dialogTaskEditor,
    dialogTaskPriorityButton,
    dialogTaskDueDateButton,
    dialogTaskTemplate,
  );
});

saveDialogEditorButton.addEventListener("click", () => {
  if (dialogTaskTemplate.checkValid()) {
    if (+dialogTaskTemplate.getAll().id === 0) {
      saveNewTask(dialogTaskTemplate, allTasks, allProjects);

      cancelEditor(
        dialogTaskEditor,
        dialogTaskPriorityButton,
        dialogTaskDueDateButton,
        dialogTaskTemplate,
      );

      resetShowTask();
      resetProjectMenu();
    } else {
      saveChangeTask(dialogTaskTemplate, allTasks, allProjects);

      cancelEditor(
        dialogTaskEditor,
        dialogTaskPriorityButton,
        dialogTaskDueDateButton,
        dialogTaskTemplate,
      );
      // showTodayTask();
      resetShowTask();
    }

    resetProjectMenu();
  }
});

mainAddTaskButton.addEventListener("click", () => {
  boxTaskEditor.style.display = "none";
  addTaskButton.style.display = "block";
  dialogTaskEditor.style.display = "block";
  dialogTaskEditor.style.zIndex = 2;
  popupOverlay.style.zIndex = 1;
  saveDialogEditorButton.textContent = "Add Task";
});

// Init
createProjectElementMenu();
resetProjectMenu = createProjectElementMenu;
showAllTask();
resetShowTask = showAllTask;

// Auto increate textbox height when type enter
document.querySelectorAll("textarea").forEach((textarea) => {
  // console.log(textarea.style.height, textarea.scrollHeight);
  // textarea.style.height = textarea.scrollHeight + "px";
  textarea.addEventListener("input", () => {
    textarea.style.height = "2rem";
    textarea.style.height = textarea.scrollHeight + "px";
  });
});
