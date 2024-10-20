import CreateWorkLogService from '../services/workLogService.js'
import WorkLogFragment from '../views/fragments/workLogFragment.js'
import WorkLogFragmentFormFragment from '../views/fragments/workLogFormFragment.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'

let tasksdb = []
export default function CreateWorkLogController({
  viewWrapper,
  workLogService = CreateWorkLogService()
}) {
  return (req, res) => {
    logger.debug(
      `Work Log Controller ${req.method} ${req.url} ${JSON.stringify(req.params)}`
    )
    const { user } = req.session
    logger.debug(`User ${JSON.stringify(user)}`)
    let wl = workLogService.getWorkLogs()

    // if (req.method === 'DELETE' && isHTMX(req)) {
    //   logger.debug(`Deleting task ${req.params[0]}`)
    //   const id = parseInt(req.params[0])
    //   tasks = tasks.filter((task) => task.id !== id)
    //   taskService().saveTasks(tasks)

    //   res.send(
    //     viewWrapper({
    //       isHTMX: true,
    //       content: TaskListFragment({ tasks, user, message: 'Task Deleted' }),
    //     })
    //   )
    //   return
    // }
    // if (req.method === 'GET' && req.url === '/tasks/addtask' && isHTMX(req)) {
    //   res.send(
    //     viewWrapper({
    //       isHTMX: true,
    //       content: TaskFormFragment({ tasks, user }),
    //     })
    //   )
    //   return
    // }
    if (req.method === 'POST' && req.url === '/worklog/addwork' && isHTMX(req)) {
      wl.push({
        id: wl.length + 1,
        description: req.body.worklogdescription,
        user,
      })

        workLogService.saveWorkLogs(wl)
      res.send(
        viewWrapper({
          isHTMX: true,
          content: WorkLogFragment({ work: wl, user, message: 'Work Added' }),
        })
      )
      return
    }
    if (req.method === 'GET' && req.url === '/worklog/addwork' && isHTMX(req)) {
      res.send(
        viewWrapper({
          isHTMX: true,
          content: WorkLogFragmentFormFragment({ user }),
        })
      )
      return
    }
    res.status(404).send('Not Found')
  }
}
