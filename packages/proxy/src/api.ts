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

app.get('/:func', async (c) => {
  const { func } = c.req.param();
  const queryParams = new URLSearchParams(c.req.query());

  const baseUrl = `https://script.google.com/macros/s/${process.env.DEPLOY_ID}/exec`;
  const targetUrl = `${baseUrl}?func=${func}&${queryParams.toString()}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json(
      {
        status: 'fail',
        message: 'Failed to forward request',
      },
      500
    );
  }
});

app.get('/envs', (c) => {
  return c.json({
    value: process.env,
  });
});

// app.get('/message', (c) => {
//   const msg = c.req.query('msg');
//   return c.text(`Success: ${msg || 'No message provided'}`);
// });

export const handler = handle(app);
