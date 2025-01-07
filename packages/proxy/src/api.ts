import { FrontAPIkeys } from '@research-vacant/common';
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { validator } from 'hono/validator';

const app = new Hono();

// TODO: FrontAPIの定義がZodに戻った場合はValidatorを下記に戻す
// zValidator('param', z.object({ func: FrontAPIkeys })),

app.get(
  '/:func',
  validator('param', (value, c) => {
    const funcName = value['func'];
    if (!FrontAPIkeys.some((fName) => fName === funcName)) {
      return c.json(
        {
          success: false,
          error: {
            issues: [
              {
                received: funcName,
                code: 'invalid_enum_value',
                options: FrontAPIkeys,
                path: ['func'],
                message: `Invalid enum value. Expected ${FrontAPIkeys.map(
                  (n) => `'${n}'`
                ).join(' | ')}, received '${funcName}'`,
              },
            ],
            name: 'ZodError_Imitated',
          },
        },
        400
      );
    }
    return {
      func: funcName,
    };
  }),
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
