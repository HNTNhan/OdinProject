import { format } from "date-fns";

let tasks, projects, labels;

if (!localStorage.getItem("tasks")) {
  const seedTasks = [
    {
      id: 1,
      title: "123",
      description: "kiqywtfqwufioqwpfqwqwg",
      dueDate: format(new Date(), "MM-dd-yyyy"), //mm-dd-yyyy
      priority: 4,
      label: "",
      complete: false,
      project: 1,
      date_create: format(new Date(), "MM-dd-yyyy"),
      user_create: "1",
    },
    {
      id: 2,
      title: "456",
      description: "asadqwdqdqwd",
      dueDate: format(new Date(), "MM-dd-yyyy"), //mm-dd-yyyy
      priority: 3,
      label: "",
      complete: false,
      project: 1,
      date_create: format(new Date(), "MM-dd-yyyy"),
      user_create: "1",
    },
    {
      id: 3,
      title: "789",
      description: "wdqszwq",
      dueDate: format(new Date(), "MM-dd-yyyy"), //mm-dd-yyyy
      priority: 1,
      label: "",
      complete: false,
      project: 2,
      date_create: format(new Date(), "MM-dd-yyyy"),
      user_create: "1",
    },
  ];
  const seedProjects = [
    {
      id: "1",
      title: "Project 1",
      tasks: [1, 2],
      date_create: format(new Date(), "MM-dd-yyyy"),
      user_create: 1,
    },
    {
      id: "2",
      title: "Project 2",
      tasks: [3],
      date_create: format(new Date(), "MM-dd-yyyy"),
      user_create: 1,
    },
  ];
  const seedLabels = ["work", "study", "play", "rest"];
  // const seedUser = [
  //   {
  //     id: 1,
  //     username: "Nhan",
  //   },
  // ];

  tasks = seedTasks;
  projects = seedProjects;
  labels = seedLabels;
  localStorage.setItem("tasks", JSON.stringify(seedTasks));
  localStorage.setItem("projects", JSON.stringify(seedProjects));
  localStorage.setItem("labels", JSON.stringify(seedLabels));
  localStorage.setItem("users", JSON.stringify(seedProjects));
} else {
  tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
  projects = JSON.parse(localStorage.getItem("projects")) ?? [];
  labels = JSON.parse(localStorage.getItem("labels")) ?? [];
}

function taskFactoryFunction(
  id,
  title,
  description,
  dueDate,
  priority,
  labels,
  complete,
  project,
  date_create,
  user_create,
) {
  let _id = id ?? 0;
  let _title = title ?? "";
  let _description = description ?? "";
  let _dueDate = dueDate ?? new Date();
  let _priority = priority ?? 4;
  let _labels = labels ?? [];
  let _complete = complete ?? false;
  let _project = project ?? null;
  let _date_create = date_create ?? new Date();
  let _user_create = user_create ?? 1;

  const getAll = () => {
    return {
      id: _id,
      title: _title,
      description: _description,
      dueDate: _dueDate,
      priority: _priority,
      labels: _labels,
      complete: _complete,
      project: _project,
      date_create: _date_create,
      user_create: _user_create,
    };
  };

  const setId = (id) => (_id = id);
  const setTitle = (title) => (_title = title);
  const setDescription = (description) => (_description = description);
  const setDueDate = (dueDate) => (_dueDate = dueDate);
  const setPriority = (priority) => (_priority = priority);
  const setLabels = (labels) => (_labels = labels);
  const setComplete = (complete) => (_complete = complete);
  const setProject = (project) => (_project = project);

  const addLabel = (label) => _labels.push(label);
  const removeLabel = (label) => {
    _labels = _labels.filter((_label) => _label !== label);
  };

  const checkValid = () => {
    if (_id >= 0 && _title !== "") return true;
    return false;
  };

  const reset = () => {
    _id = 0;
    _title = "";
    _description = "";
    _dueDate = new Date();
    _priority = 4;
    _labels = [];
    _complete = false;
    _project = undefined;
    _date_create = new Date();
    _user_create = 1;
  };

  return {
    getAll,
    setId,
    setTitle,
    setDescription,
    setDueDate,
    setPriority,
    setLabels,
    setComplete,
    setProject,
    addLabel,
    removeLabel,
    reset,
    checkValid,
  };
}

function projectFactoryFunction(id, title, tasks, date_create, user_create) {
  let _id = id ?? 0;
  let _title = title ?? "";
  let _tasks = tasks ?? [];
  let _date_create = date_create ?? new Date();
  let _user_create = user_create ?? 1;

  const getAll = () => {
    return {
      id: _id,
      title: _title,
      tasks: _tasks,
      date_create: _date_create,
      user_create: _user_create,
    };
  };

  const setId = (id) => (_id = id);
  const setTitle = (title) => (_title = title);
  const setTasks = (tasks) => (_tasks = tasks);

  const addTask = (taskId) => _tasks.push(taskId);
  const removeTask = (taskId) => {
    _tasks = _tasks.filter((_taskId) => _taskId !== taskId);
  };
  const uniqueTasksArr = () => {
    _tasks = [...new Set(_tasks)];
  };

  return { getAll, setId, setTitle, setTasks, addTask, removeTask, uniqueTasksArr };
}

let allTasks = (function () {
  let tempArr = [];
  for (let task of tasks) {
    let taskObj = taskFactoryFunction(
      task.id,
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      task.labels,
      task.complete,
      task.project,
      task.date_create,
      task.user_create,
    );
    tempArr.push(taskObj);
  }

  return tempArr;
})();

let allProjects = (function () {
  let tempArr = [];
  for (let project of projects) {
    let projectObj = projectFactoryFunction(
      project.id,
      project.title,
      project.tasks,
      project.date_create,
      project.user_create,
    );
    tempArr.push(projectObj);
  }

  return tempArr;
})();

let allLabels = labels;

export { allTasks, allProjects, allLabels, taskFactoryFunction, projectFactoryFunction };
