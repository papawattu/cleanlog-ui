export default ({ message = 'Task List', tasks = [], user } = {}) => {
  if (!tasks.length) {
    return String.raw`
        <p id="notasks">${user} you have no tasks</p>`
  }
  return String.raw`<h2 id="message">${message}</h2>
    <ul id="tasks">
      ${tasks
        .map(
          (task) => String.raw`<li>
          <h3>${task.name}</h3>
          <p>${task.description}</p>
        </li>`
        )
        .join('')}
    </ul>`
}
