import { differenceInCalendarDays } from "date-fns";
import { allTasks, allProjects, allLabels } from "./data";
// Task
const getAllTasks = () => allTasks;

const getTaskByDate = (dateStart, dateEnd = null) => {
  return allTasks.filter((task) => {
    const taskDate = task.getAll().dueDate;
    if (!dateEnd) {
      return differenceInCalendarDays(new Date(dateStart), new Date(taskDate)) === 0;
    } else {
      if (
        differenceInCalendarDays(new Date(dateStart), new Date(taskDate)) <= 0 &&
        differenceInCalendarDays(new Date(dateEnd), new Date(taskDate)) >= 0
      ) {
        return true;
      }
      return false;
    }
  });
};

const getTaskByPriority = (priority) => {
  return allTasks.filter((task) => {
    const taskProiority = +task.getAll().priority;
    return taskProiority === priority;
  });
};

const getCompletedTask = () => {
  return allTasks.filter(
    (task) => task.getAll().complete === true || task.getAll().complete === "true",
  );
};

const getTaskById = (id) => {
  return allTasks.find((task) => +task.getAll().id === +id);
};

const getTaskByProjectId = (projectId) => {
  return allTasks.filter((task) => +task.getAll().project === +projectId);
};

const saveAllTasks = (tasks) => {
  const tempArr = [];
  for (let task of tasks) {
    tempArr.push(task.getAll());
  }
  localStorage.setItem("tasks", JSON.stringify(tempArr));
};

// Project
const getAllProjects = () => allProjects;

const getProjectById = (id) => {
  for (let project of allProjects) {
    if (project.getAll().id === id) return project;
  }

  return null;
};

const saveAllProjects = (projects) => {
  const tempArr = [];
  for (let project of projects) {
    tempArr.push(project.getAll());
  }
  localStorage.setItem("projects", JSON.stringify(tempArr));
};

// Labels
const getAllLabels = () => allLabels;

const getLabelByName = (name) => {
  for (let label of allLabels) {
    if (label === name) return label;
  }

  return null;
};

const saveAllLabels = (labels) => {
  localStorage.setItem("labels", JSON.stringify(labels));
};

export {
  getAllTasks,
  getTaskByDate,
  saveAllTasks,
  getAllProjects,
  getProjectById,
  getTaskByPriority,
  getTaskById,
  getTaskByProjectId,
  saveAllProjects,
  getCompletedTask,
  getAllLabels,
  getLabelByName,
  saveAllLabels,
};
