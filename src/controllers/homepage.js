export default function HomepageController() {
  return (req, res) => {
    res.send(`<html>
      <head>
        <title>Home Page</title>
      </head>
      <body>
        <h1>Welcome to the Home Page</h1>
      </body>`)
  }
}
