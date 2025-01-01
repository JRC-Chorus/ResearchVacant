
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello/:name', (c) => {
  const name = c.req.param('name')
  return c.text(`Success: Hello ${name}!`)
})

app.get('/message', (c) => {
  const msg = c.req.query('msg')
  return c.text(`Success: ${msg || 'No message provided'}`)
})

export default app
