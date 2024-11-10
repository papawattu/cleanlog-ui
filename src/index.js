import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import es6Renderer from 'express-es6-template-engine'
import cookieParser from 'cookie-parser'

// set __dirname to current file path for es6 modules
const __dirname = path.dirname(new URL(import.meta.url).pathname)

const app = express()

// express router
const router = express.Router()

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(router)

router.get('/', (req, res) => {
    res.cookie('token', 'mytoken')
    res.render('index')
})

router.get('/worklog', async (req, res) => {

    const workList = await fetch('http://localhost:3001/api/worklog/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    }).catch(err => {
        console.error(err)
        res.send('Error').status(500)
        return
    })

    if(!workList) {
        res.send('Error').status(500)
        return
    }
    if(workList.status !== 200) {
        res.send(`Error ${workList.status}`).status(500)
        return
    }
    const work = await workList.json()

    res.render('worklog',{ locals: { workList: work.worklogs ? work.worklogs : [] }})
})
router.get('/addwork', (req, res) => {
    res.render('addwork', { locals: { work : { description: '', date: '', hours: '' } }})
})
router.get('/editwork/:id', async (req, res) => {
    const id = req.params.id
    const workList = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })

    const work = await workList.json()

    res.render('addwork', { locals: { work }})
})
router.post('/addwork', async (req, res) => {
    const { description, date, hours } = req.body

    const resp = await fetch('http://localhost:3001/api/worklog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        },
        body: JSON.stringify({ description, date, hours })
    }).catch(err => {
        console.error(err)
        res.send('Error').status(500)
        return
    })

    if(!resp) {
        return
    }

    if(resp.status !== 201) {
        res.send('Error ' + resp.statusText).status(resp.status)
        return
    }
    
    if(!resp.headers.has('Location')) {
        res.send('Error location expected').status(500)
        return
    } 

    const location = resp.headers.get('Location')

    let r, retries = 0
    do {
        r = await fetch(`http://localhost:3001${location}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['token']
            }
        }).catch(err => {
            console.error(err)
            res.send('Error').status(500)
            return
        })

        if(r.status !== 200) {
            retries++
            await new Promise(resolve => setTimeout(resolve, 200))
        }
    } while (r.status !== 200 && retries < 10)

    if(r.status !== 200) {
        res.send('Timeout').status(500)
        return
    }

    const workList = await fetch('http://localhost:3001/api/worklog/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token'],
        }
    })
    
    const { worklogs } = await workList.json()
        .catch(err => {
            console.error(err)
            res.send('Error cannot unmarshal json').status(500)
            return
        })  
    

    res.render('worklog',{ locals: { workList: worklogs }})
})
router.post('/editwork/:id', async (req, res) => {
    const id = req.params.id
    const { description, date, hours } = req.body
    
    const resp = await fetch('http://localhost:3001/api/worklog/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        },
        body: JSON.stringify({ description, date, hours })
    }).catch(err => {
    
        res.send('Error ' + err).status(500)
        return
    })

    if(!resp) {
        return
    }

    if(resp.status !== 200) {
        res.send('Error').status(500)
        return
    }
    const json = await resp.json().catch(err => {
    
        res.send('Error').status(500)
        return
    
    })
    
    const workList = await fetch('http://localhost:3001/api/worklog/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token'],
        }
    })

    const { worklogs } = await workList.json()
    
    
    res.render('worklog',{ locals: { workList: worklogs }})
})
router.get('/editwork/:id', async (req, res) => {
    const id = req.params.id
    const workList = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })
    const { worklogs } = await workList.json()
    worklogs.id = id
    res.render('editwork',{ locals: { work: worklogs }})
})

router.get('/deletework/:id', async (req, res) => {
    const id = req.params.id
    const response = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })
    
    if(response.status !== 204) {
        res.send('Error').status(500)
        return
    } 

    const workList = await fetch('http://localhost:3001/api/worklog/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token'],
        }
    })
    const { worklogs } = await workList.json()
    
    res.render('worklog',{ locals: { workList: worklogs }})
   
})  

app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    const workList = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })
    const work = await workList.json()

    const taskList = await Promise.all(work.taskIds.map(async taskId => {
        const task = await fetch(`http://localhost:3002/api/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['token']
            }
        })
        return await task.json()
    }))
    
    res.render('tasks',{ locals: { work, taskList }})
})   

app.get('/addtask/:id', async (req, res) => {
    const id = req.params.id
    const workList = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })
    const work = await workList.json()

    res.render('addtask',{ locals: { work }})
})

app.post('/addtask/:id', async (req, res) => {
    const id = req.params.id
    const { description, date, hours } = req.body
    
    const resp = await fetch('http://localhost:3002/api/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        },
        body: JSON.stringify({ description, date, hours })
    }).catch(err => {
    
        res.send('Error ' + err).status(500)
        return
    })

    if(!resp) {
        return
    }

    if(resp.status !== 201) {
        res.send('Error').status(500)
        return
    }
    
    if(!resp.headers.has('Location')) {
        res.send('Error location expected').status(500)
        return
    }

    const location = resp.headers.get('Location')
    console.log(`Location ${location}`)
    let r, retries = 0

    do {    
        r = await fetch(`http://localhost:3002${location}`, {
          method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['token'],
            }
        })

    } while (r.status !== 200 && retries < 10)

    if(r.status !== 200) {
        res.send('Timeout').status(500)
        return
    }
    const json = await r.json()

    const r2 = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        },
        body: JSON.stringify({ taskIds: [json.taskId] })
    })
        
    
    if(r2.status !== 204) {
        res.send('Error ' + r2.status).status(500)
        return
    }
    
    const workReq = await fetch(`http://localhost:3001/api/worklog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies['token']
        }
    })
    const work = await workReq.json()

    const taskList = await Promise.all(work.taskIds.map(async taskId => {
        const task = await fetch(`http://localhost:3002/api/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['token']
            }
        })
        if(task.status !== 200) {
            console.error('Error task status :' + task.status)
            return undefined
        }
        return await task.json()
    }))
 
    res.render('tasks',{ locals: { work, taskList }})
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

