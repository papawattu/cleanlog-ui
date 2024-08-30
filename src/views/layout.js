import NavFragment from './fragments/navFragment.js'
import FooterFragment from './fragments/footerFragment.js'

export default ({
  title = 'Home Page',
  content,
  user = null,
} = {}) => String.raw`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>  
    <script src="/js/htmx.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async></script>
    <link rel="stylesheet" href="/css/output.css">
  </head>
  <body class="container mx-auto px-4">
    <div class="flex flex-col min-h-screen">
      <div class="z-50">
        <header class="border">
          ${NavFragment({ user })}
        </header>
        <main id="main" class="mb-auto">
          ${content}
        </main>
        <footer>
          ${FooterFragment()}
        </footer>
      </div>
    </div>
  </body>
</html>`
