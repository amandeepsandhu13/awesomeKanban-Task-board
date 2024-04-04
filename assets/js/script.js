// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const buttonElement = document.querySelector('#toggle-btn-form');

const projectDisplayEl = $('#project-display');
const projectFormEl = $('#project-form');
const projectNameInputEl = $('#project-name-input');
const projectTypeInputEl = $('#project-type-input');
const projectDateInputEl = $('#taskDueDate');

// Todo: create a function to generate a unique task id
function generateTaskId() {
  
  let randomId = Math.random().toString(36).substr(2, 9);
  let timestamp = new Date().getTime().toString(36);
  let uniqueId = randomId + timestamp;
  return uniqueId;
    
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// ? Accepts an array of projects, stringifys them, and saves them in localStorage.
function saveProjectsToStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  
  // ? Retrieve projects from localStorage and parse the JSON to an array.
  // ? We use `let` here because there is a chance that there are no projects in localStorage (which means the projects variable will be equal to `null`) and we will need it to be initialized to an empty array.
  let projects = JSON.parse(localStorage.getItem('projects'));

  // ? If no projects were retrieved from localStorage, assign projects to a new empty array to push to later.
  if (!projects) {
    projects = [];
  }

  // ? Return the projects array either empty or with data in it whichever it was determined to be by the logic right above.
  return projects;

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});

