import PocketBase from '/js/pocketbase.es.mjs'
import { createCalendar } from '/js/calendar.js'

const pb = new PocketBase(process.env.POCKETBASE_API_URL)

let user = null

document.addEventListener('DOMContentLoaded', function() {
    init();
})

async function updateAmount(user) {
    
    console.log(user)
    const amount = await pb.collection('amount').getFirstListItem(`user=${user}`, {})
    
    document.getElementById('amount').innerHTML = amount
}
async function updateName(name) {
    
    document.getElementById('firstname').innerHTML = name

}
async function init() {
    
    //const userData = await pb.collection('users').authWithPassword('test@example.com', '1234567890');
    console.log('Authenticating with Google')
    const userData = await pb.collection('users').authWithOAuth2({ provider: 'google'}).catch(e => console.error(e))
    console.log(JSON.stringify(userData, null, 2))
   
    const { record: { name, id } } = userData
    user = { name, id }
    console.log(JSON.stringify(userData, null, 2))
    //updateAmount(id)
    updateName(name)

    document.getElementById('addworklog').addEventListener('click', async function(e) {
        e.preventDefault()
        const form = document.getElementById('addworklogform').elements 

        const date = form.date.value
        const hours = form.hours.value
        const id = user.id

        console.log('Adding worklog' + JSON.stringify(form, null, 2))
        const worklog = {
            user: user.id,
            date,
            hours,
            description: 'Worked on the project'
        }
        await pb.collection('worklog').create(worklog)
        //updateAmount(id)
    })

    console.log(createCalendar(2021, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
}
