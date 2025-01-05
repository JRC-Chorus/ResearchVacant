import { zValidator } from '@hono/zod-validator';
import { FrontAPIkeys } from '@research-vacant/common';
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { z } from 'zod';

const app = new Hono();

app.get(
  '/:func',
  zValidator('param', z.object({ func: FrontAPIkeys })),
  async (c) => {
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
  }
);

export const handler = handle(app);
