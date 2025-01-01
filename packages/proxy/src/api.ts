import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { z } from 'zod';

const app = new Hono();

app.get(
  '/hello/:name',
  zValidator(
    'param',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.param();
    return c.json({
      status: 'success',
      message: `Hello ${name}!`,
    });
  }
);

// app.get('/message', (c) => {
//   const msg = c.req.query('msg');
//   return c.text(`Success: ${msg || 'No message provided'}`);
// });

export const handler = handle(app);
