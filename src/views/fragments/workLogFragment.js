export default ({
  message = 'Task List',
  work = [],
  user: { given_name },
} = {}) => {
  if (!work.length) {
    return String.raw`<h2 id="message">${message}</h2>
        <p id="nowork">${given_name} you have no logged work</p>`
  }
  return String.raw`<h2 id="message">${message}</h2>
  <div id="worklog">
    <ul class="flex">
      ${work
        .map(
          (work) => String.raw`<li id="work-${work.id}">
          <h3>${work.id}</h3>
          <p>${work.description}</p><button id="edit" hx-get="/worklog/${work.id}" hx-target="#worklog">Edit</button><button id="deletework" hx-delete="/work/${work.id}" hx-target="#work">Delete</button>
        </li>`
        )
        .join('')}
    </ul></div>`
}
