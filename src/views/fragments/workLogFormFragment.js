export default ({ title = 'Work log Form' } = {}) => {
    return String.raw`<title>${title}</title><form id="worklogform" hx-post="/worklog/addwork" hx-target="#worklog">
      <label for="worklogdescription">Work Description</label>
      <input type="text" id="worklogdescription" name="worklogdescription" required>
      <button type="submit">Start Work</button>
    </form>`
  }