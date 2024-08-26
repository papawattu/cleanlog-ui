import { titleHelper } from '../helpers/helpers.js'
import TaskListFragment from './fragments/taskListFragment.js'

export default ({ title = 'Welcome Page', user, tasks } = {}) => {
  return String.raw`${titleHelper(title)}
    <main class="min-h-screen">
      <h3 class="text-2xl font-bold mb-4">Welcome back ${user}</h3>
      <div id="tasks" class="mb-4">${TaskListFragment({ user, tasks })}</div>
      <div><p id="noworklogged" class="text-gray-500">${user} you have no work logged</p></div>
      <button id="addtask" hx-get="/tasks/addtask" hx-target="#tasks" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Task</button>
      <button id="logwork" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Log Work</button>
      <div></div>
    </main>`
}
