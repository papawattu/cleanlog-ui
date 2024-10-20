export default function CreateWorkLogService() {
  let worklogsdb = []
  return {
    getWorkLogs: () => worklogsdb,
    saveWorkLogs: (worklogs) => {
      worklogsdb = worklogs
    },
  }
}