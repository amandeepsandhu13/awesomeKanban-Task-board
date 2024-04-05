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
function createTaskCard(task) 
{
    
  const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data-project-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardStatus = $('<p>').addClass('card-text').text(task.status);

  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardStatus, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;

}

//function to render the task list and make cards draggable
function renderTaskList() {

  // Retrieve projects from localStorage and parse the JSON to an array.
// We use `let` here because there is a chance that there are no projects in localStorage (which means the projects variable will be equal to `null`) and we will need it to be initialized to an empty array.
let tasks = JSON.parse(localStorage.getItem('tasks'));

// ? If no projects were retrieved from localStorage, assign projects to a new empty array to push to later.
if (!tasks) {
  tasks = [];
}

// Return the projects array either empty or with data in it whichever it was determined to be by the logic right above.
return tasks;

}

//display tasks on screen

function printProjectData()
{

    const tasks = renderTaskList();

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // ? Loop through projects and create project cards for each status
    for (let task of tasks) {
      if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
      }
    }

    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
      helper: function (e) {
        // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
}

//  Accepts an array of projects, stringifys them, and saves them in localStorage.
function saveProjectsToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//function to render the task list and make cards draggable
function renderTaskList() 
{
   // ? Retrieve projects from localStorage and parse the JSON to an array.
   // ? We use `let` here because there is a chance that there are no projects in localStorage (which means the projects variable will be equal to `null`) and we will need it to be initialized to an empty array.
  let tasks = JSON.parse(localStorage.getItem('tasks'));
 
   // ? If no projects were retrieved from localStorage, assign projects to a new empty array to push to later.
  if (!tasks) {
     tasks = [];
  }
 
   // Return the projects array either empty or with data in it whichever it was determined to be by the logic right above.
  return tasks;
}

// function to handle adding a new task
function handleAddTask(event){

  event.preventDefault();

  const taskId = generateTaskId();
  // ? Read user input from the form
  const projectName = projectNameInputEl.val().trim();
  const projectType = projectTypeInputEl.val(); // don't need to trim select input
  const projectDate = projectDateInputEl.val(); // yyyy-mm-dd format

  const newProject = {
    // ? Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    id: taskId,
    name: projectName,
    type: projectType,
    dueDate: projectDate,
    status: 'to-do',
  };

  // Pull the projects from localStorage and push the new project to the array
  const tasks = renderTaskList();
  tasks.push(newProject);

  // Save the updated projects array to localStorage
  saveProjectsToStorage(tasks);

  // Print project data back to the screen
  printProjectData();

  // Clear the form inputs
  projectNameInputEl.val('');
  projectTypeInputEl.val('');
  projectDateInputEl.val('');
}

// function to handle deleting a task
function handleDeleteTask(event){

  const projectId = $(this).attr('data-project-id');
  const tasks = renderTaskList();
  
  // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
  tasks.forEach((task) => {
    if (task.id === projectId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // We will use our helper function to save the projects to localStorage
  saveProjectsToStorage(tasks);

  // Here we use our other function to print projects back to the screen
  printProjectData();

}

// function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  
  // Read projects from localStorage
  const tasks = renderTaskList();

  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.projectId;

   // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // Find the project card by the `id` and update the project status.

    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  printProjectData();  

}

projectFormEl.on('submit', handleAddTask);
projectDisplayEl.on('click', '.btn-delete-project', handleDeleteTask);

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  printProjectData();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });
      // ? Make lanes droppable
  $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
  });
});