export default ({ title = 'Task Form' } = {}) => {
  return String.raw`<form id="taskform" hx-post="/tasks/addtask" hx-target="#tasks">
    <label for="taskname">Task Name</label>
    <input type="text" id="taskname" name="taskname" required>
    <label for="taskdescription">Task Description</label>
    <textarea id="taskdescription" name="taskdescription" required></textarea>
    <button type="submit">Add Task</button>
  </form>`
}
