import { titleHelper } from '../helpers/helpers.js'
import TaskListFragment from './fragments/taskListFragment.js'

export default ({ title = 'Welcome Page', user, tasks } = {}) => {
  const { given_name } = user
  return String.raw`${titleHelper(title)}
    <main class="">
      <h3 class="">Welcome back ${given_name}</h3>
      <div id="tasks" class="">${TaskListFragment({ user, tasks })}</div>
      <div id="worklog"><p id="noworklogged" class="">${given_name} you have no work logged</p></div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="addtask" hx-get="/tasks/addtask" hx-target="#tasks" class="">Add Task</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="logwork" hx-get="/worklog/addwork" hx-target="#worklog" class="">Log Work</button>
      <div></div>
    </main>`
}
