export default ({ title = 'Home Page', content } = {}) => String.raw`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>  
    <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>
    ${content}
    <footer>
      <p>Footer</p>
    </footer>
  </body>
</html>`
