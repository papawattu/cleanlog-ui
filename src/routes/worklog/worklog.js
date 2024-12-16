import { cli } from 'winston/lib/winston/config/index.js'
import { createCalendar } from '../../utils/calendar.js'

export default (router) => {
  const daysWorked = []
  router.get('/view/worklog', (req, res) => {
    const currentDate = new Date()

    const amountPerDay = 30
    const data = {
      name: {
        first: 'Laura',
        last: 'Doe',
      },
      daysWorked,
      date: {
        month: currentDate.toLocaleString('default', { month: 'long' }),
        day: `${currentDate.getDate()}${
          currentDate.getDate() === 1
            ? 'st'
            : currentDate.getDate() === 2
            ? 'nd'
            : currentDate.getDate() === 3
            ? 'rd'
            : 'th'
        }`,
        year: currentDate.getFullYear(),
      },

      amount: daysWorked.length * amountPerDay,

      cal: createCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        daysWorked
      ),
      title: 'Log Work',
      login_url: process.env.GOOGLE_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID,
    }

    res.render('main', {
      locals: data,
      partials: {
        logo: 'fragment/logo',
        calendar: 'fragment/calendar',
        profile: 'fragment/profile',
        form: 'fragment/addwork',
        modal: 'fragment/modal',
      },
    })
  })

  router.get('/view/worklog/:yy/:mm/:dd', (req, res) => {
    const yy = parseInt(req.params.yy)
    const mm = parseInt(req.params.mm)
    const dd = parseInt(req.params.dd)

    if (yy < 2024) {
      res.redirect('/view/worklog')
      return
    }
    if (mm < 1 || mm > 12) {
      res.redirect('/view/worklog')
      return
    }
    if (dd < 1 || dd > 31) {
      res.redirect('/view/worklog')
      return
    }

    const date = new Date(yy, mm - 1, dd)

    res.render('worklog', { locals: data })
  })
  router.get('/view/fragment/addwork', (req, res) => {
    const todaysDate = new Date().toISOString().split('T')[0]
    res.render('fragment/addwork', {
      locals: { work: { description: '' }, todaysDate },
    })
  })
  router.post('/addwork', (req, res) => {
    const d = new Date(req.body.date)

    daysWorked.push(d.getDate(d))
    console.log(daysWorked)
    res.render('fragment/addtasks', { locals: req.body })
  })
  router.get('/view/calendar', (req, res) => {
    const date = new Date()
    res.render('calendar', {
      locals: {
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        calendarTable: createCalendar(date.getFullYear(), date.getMonth() + 1),
        next: {
          month: date.getMonth() === 11 ? 0 : date.getMonth() + 1,
          year:
            date.getMonth() === 11
              ? date.getFullYear() + 1
              : date.getFullYear(),
        },
        prev: {
          month: date.getMonth() === 0 ? 11 : date.getMonth() - 1,
          year:
            date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(),
        },
      },
      partials: { calendar: 'fragment/calendar' },
    })
  })

  router.get('/view/calendar/:yy/:mm', (req, res) => {
    let date
    if (req.params.yy === undefined || req.params.mm === undefined) {
      date = new Date()
    } else {
      date = new Date(req.params.yy, req.params.mm - 1)
    }
    res.render('calendar', {
      locals: {
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        calendarTable: createCalendar(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        ),
        next: {
          month: date.getMonth() === 11 ? 0 : date.getMonth() + 1,
          year:
            date.getMonth() === 11
              ? date.getFullYear() + 1
              : date.getFullYear(),
        },
        prev: {
          month: date.getMonth() === 0 ? 11 : date.getMonth() - 1,
          year:
            date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(),
        },
      },
      partials: { calendar: 'fragment/calendar' },
    })
  })
}
