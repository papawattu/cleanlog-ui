export default ({ message = 'Task List', tasks = [], user } = {}) => {
  if (!tasks.length) {
    return String.raw`<h2 id="message">${message}</h2>
        <p id="notasks">${user} you have no tasks</p>`
  }
  return String.raw`<h2 id="message">${message}</h2>
    <ul id="tasks" class="flex">
      ${tasks
        .map(
          (task) => String.raw`<li id="task-${task.id}">
          <h3>${task.name}</h3>
          <p>${task.description}</p><button id="edit" hx-get="/tasks/${task.id}" hx-target="#tasks">Edit</button><button id="deletetask" hx-delete="/tasks/${task.id}" hx-target="#tasks">Delete</button>
        </li>`
        )
        .join('')}
    </ul>`
}
