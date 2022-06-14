import { format, differenceInCalendarDays } from "date-fns";
import { taskFactoryFunction, projectFactoryFunction } from "./data";
import { saveAllTasks, saveAllProjects, saveAllLabels } from "./data-api";

// Global variable
let resetShowTask;
let resetProjectMenu;

//// BOX EDITOR TASK
let taskTemplate = taskFactoryFunction();

// Change task due date text after modify
function checkDate(date) {
  let showDate;
  if (differenceInCalendarDays(date, new Date()) === 0) {
    showDate = "Today";
  } else if (differenceInCalendarDays(date, new Date()) === 1) {
    showDate = "Tomorrow";
  } else {
    showDate = format(date, "dd MMM yyyy");
  }
  return showDate;
}

function saveNewTask(saveTask, allTasks, allProjects) {
  saveTask.setId(allTasks[allTasks.length - 1].getAll().id + 1);
  let temp = taskFactoryFunction(...Object.values(saveTask.getAll()));
  allTasks.push(temp);
  saveAllTasks(allTasks);

  if (temp.getAll().project) {
    const project = allProjects.find((project) => +project.getAll().id === +temp.getAll().project);
    project.addTask(temp.getAll().id);
    saveAllProjects(allProjects);
  }
}

function saveChangeTask(saveTask, allTasks, allProjects) {
  const index = allTasks.findIndex((task) => +task.getAll().id === +saveTask.getAll().id);
  let temp = taskFactoryFunction(...Object.values(saveTask.getAll()));
  allTasks[index] = temp;
  saveAllTasks(allTasks);

  if (oldProjectOfTask !== temp.getAll().project) {
    if (temp.getAll().project) {
      const project = allProjects.find(
        (project) => +project.getAll().id === +temp.getAll().project,
      );
      project.addTask(temp.getAll().id);
    }
    if (oldProjectOfTask) {
      const project = allProjects.find((project) => +project.getAll().id === +oldProjectOfTask);
      project.removeTask(temp.getAll().id);
    }

    allProjects = allProjects.map((project) => {
      project.uniqueTasksArr();
      return project;
    });

    saveAllProjects(allProjects);
  }
}

//// Dailog Editor
let dialogTaskTemplate = taskFactoryFunction();
let oldProjectOfTask = null;

//// Prevent scroll
var keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    }),
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
window.addEventListener("scroll", (e) => {
  e.preventDefault();
});
// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  window.addEventListener("scroll", preventDefault, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  window.removeEventListener("scroll", preventDefault, false);
}

// Remove project from task
function removeProjectFromAllTasks(projectId, tasks) {
  for (let i = 0; i < tasks.length; i++) {
    if (+tasks[i].getAll().project === +projectId) tasks[i].setProject(null);
  }
}

export {
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
};
