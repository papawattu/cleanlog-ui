import { titleHelper } from '../helpers/helpers.js'
import TaskListFragment from './fragments/taskListFragment.js'

export default ({ title = 'Welcome Page', user, tasks } = {}) => {
  return String.raw`${titleHelper(title)}
    <main>
      <h3>Welcome back ${user}</h3>
      <div id="tasks">${TaskListFragment({ user, tasks })}</div>
      <div><p id="noworklogged">${user} you have no work logged</p></div>
      <button id="addtask" hx-get="/tasks/addtask" hx-target="#tasks">Add Task</button>
      <button id="logwork">Log Work</button>
      <div></div>
    </main>`
}
