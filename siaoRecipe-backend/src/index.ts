import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors'; 
import mainRouter from './routes/main.route.js';

const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/', mainRouter);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
