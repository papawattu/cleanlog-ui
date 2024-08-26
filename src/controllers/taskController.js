import TaskFormFragment from '../views/fragments/taskFormFragment.js'
import TaskListFragment from '../views/fragments/taskListFragment.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'

let tasksdb = []
export default function CreateTaskController({
  viewWrapper,
  taskService = () => ({
    getTasks: () => tasksdb,
    saveTasks: (tasks) => {
      tasksdb = tasks
    },
  }),
}) {
  return (req, res) => {
    const { user } = req.session
    const tasks = taskService().getTasks()

    logger.debug(`TaskController ${req.method} ${req.url}`)
    if (req.method === 'GET' && req.url === '/tasks/' && isHTMX(req)) {
      res.send(
        viewWrapper({
          isHTMX: true,
          content: TaskListFragment({ tasks, user }),
        })
      )
      return
    }
    if (req.method === 'GET' && req.url === '/tasks/addtask' && isHTMX(req)) {
      res.send(
        viewWrapper({
          isHTMX: true,
          content: TaskFormFragment({ tasks, user }),
        })
      )
      return
    }
    if (req.method === 'POST' && req.url === '/tasks/addtask' && isHTMX(req)) {
      tasks.push({
        name: req.body.taskname,
        description: req.body.taskdescription,
        user,
        complete: false,
      })

      taskService().saveTasks(tasks)
      res.send(
        viewWrapper({
          isHTMX: true,
          content: TaskListFragment({ tasks, user, message: 'Task Added' }),
        })
      )
      return
    }
    res.status(404).send('Not Found')
  }
}
