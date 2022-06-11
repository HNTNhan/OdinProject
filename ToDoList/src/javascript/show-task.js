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
} from "./data-api";
import {
  addEventWhenClickTaskLi,
  resetShowTask,
  resetProjectMenu,
  addEventTaskStatusChange,
} from "./utilites";
import { createProjectElementMenu } from "./modify-dom-functions";

// Project Menu
// const projectContainer = document.querySelector("#menu-project-container");
// const projectList = projectContainer.querySelector("#project-list");

// const createProjectMenu = () => {
//   projectList.innerHTML = "";
//   const allProjects = getAllProjects();
//   for (let i = 0; i < allProjects.length; i++) {
//     const details = document.createElement("details");
//     const summary = document.createElement("summary");
//     const ul = document.createElement("ul");

//     details.classList.add("project");
//     details.addEventListener("click", (e) => {
//       resetShowTask = function () {
//         showTasksInProject(allProjects[i].getAll().title, allProjects[i].getAll().id);
//       };
//       showTasksInProject(allProjects[i].getAll().title, allProjects[i].getAll().id);

//       const projectList = document.querySelectorAll(".project");
//       for (let j = 0; j < projectList.length; j++) {
//         if (projectList[j] !== details) projectList[j].removeAttribute("open");
//       }
//     });

//     for (let taskId of allProjects[i].getAll().tasks) {
//       const task = getTaskById(taskId);

//       if (task) {
//         const li = document.createElement("li");
//         li.textContent = task.getAll().title;
//         addEventWhenClickTaskLi(li, task);
//         ul.appendChild(li);
//       }
//     }

//     summary.textContent = allProjects[i].getAll().title;

//     details.appendChild(ul);
//     details.appendChild(summary);
//     projectList.appendChild(details);
//   }
// };

// Sidebar Menu
const taskContainer = document.querySelector("#list-tasks-container");
const taskContentTitle = document.querySelector(".list-tasks-section > header >.title > h1");

const showAllTaskButton = document.querySelector("#show-all-task");
const showTodayTaskButton = document.querySelector("#show-today-task");
const showTodayTaskIn7DayButton = document.querySelector("#show-task-in-7-day");
const showImportantTaskButton = document.querySelector("#show-important-task");
const showCompleteTaskButton = document.querySelector("#show-completed-task");

const showAllTask = () => {
  showTasks(getAllTasks(), "All");
};

const showTodayTask = () => {
  const todayTasks = getTaskByDate(new Date());
  showTasks(todayTasks, "Today");
};

const showTaskIn7Day = () => {
  const taskIn7Day = getTaskByDate(new Date(), addDays(new Date(), 7));
  showTasks(taskIn7Day, "In 7 Days");
};

const showImportantTask = () => {
  const importantTask = getTaskByPriority(1);
  showTasks(importantTask, "Important Tasks");
};

const showCompleteTask = () => {
  const completeTask = getCompletedTask();
  showTasks(completeTask, "Complete Tasks", true);
};

const showTasksInProject = (projectTitle, projectId) => {
  const tasksInProject = getTaskByProjectId(projectId);
  showTasks(tasksInProject, projectTitle, true);
};

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

function showTasks(tasks, title, complete = false) {
  taskContainer.innerHTML = "";
  taskContentTitle.textContent = title;
  if (tasks.length > 0) {
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
                        <button class="icon-button small-icon edit-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button class="icon-button small-icon change-date-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar4-event" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                            <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                          </svg>
                        </button>
                        <button class="icon-button small-icon comment-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                          </svg>
                        </button>
                        <button class="icon-button small-icon change-priority-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
                            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                          </svg>
                        </button>
                        <button class="icon-button small-icon change-project-priority">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-symlink" viewBox="0 0 16 16">
                            <path d="m11.798 8.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742z" />
                            <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm.694 2.09A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09l-.636 7a1 1 0 0 1-.996.91H2.826a1 1 0 0 1-.995-.91l-.637-7zM6.172 2a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
                          </svg>
                        </button>
                        <button id="delete-task-button-${task.id}" class="icon-button small-icon delete-task-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                          </svg>
                        </button>
                      </div>`;
      const editTaskButton = li.querySelector(".edit-button");
      const commentButton = li.querySelector(".comment-button");
      const deleteTaskButton = li.querySelector(".delete-task-button");

      li.querySelector("input").addEventListener("click", (e) => {
        e.stopPropagation();
      });

      li.querySelector(".group-features").addEventListener("click", (e) => {
        e.stopPropagation();
      });

      addEventTaskStatusChange(li.querySelector(".complete-checkbox-button"), taskObj);
      editTaskButton.addEventListener("click", () => {});

      deleteTaskButton.addEventListener("click", (e) => {
        const buttonId = e.currentTarget.id.match(/[1-9]*$/);
        const index = getAllTasks().findIndex((task) => {
          return +task.getAll().id === +buttonId[0];
        });
        if (index >= 0) {
          getAllTasks().splice(index, 1);
          saveAllTasks(getAllTasks());
          li.parentNode.removeChild(li);
        }
      });

      addEventWhenClickTaskLi(li, taskObj);

      ul.appendChild(li);
    }

    taskContainer.appendChild(ul);
  }
}

showAllTask();
createProjectElementMenu();
resetShowTask = showAllTask;
resetProjectMenu = createProjectElementMenu;
