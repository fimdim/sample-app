import express, { Request, Response } from 'express';
import { addTask, getAllTasks, getNextId } from './store';
import { filterByMinPriority, topTasks } from './tasks';
import { Priority, Task } from './types';

export const router = express.Router();

// GET /tasks  -> all tasks, optionally filtered by ?minPriority=
router.get('/tasks', (req: Request, res: Response) => {
  const min = req.query.minPriority;
  if (min !== undefined) {
    return res.json(filterByMinPriority(Number(min) as Priority));
  }
  return res.json(getAllTasks());
});

// GET /tasks/top?limit=  -> highest priority tasks
router.get('/tasks/top', (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  return res.json(topTasks(limit));
});

// POST /tasks  -> create a task
// SECURITY/VALIDATION GAP (planted): the request body is trusted as-is.
// `title` and `priority` are never validated, so empty titles, missing
// fields, huge payloads, or out-of-range priorities are all accepted.
router.post('/tasks', (req: Request, res: Response) => {
  const body = req.body as { title: string; priority: Priority };
  const task: Task = {
    id: getNextId(),
    title: body.title,
    priority: body.priority,
    done: false,
    createdAt: new Date().toISOString(),
  };
  addTask(task);
  return res.status(201).json(task);
});

// GET /tasks/search?q=  -> search task titles
// SECURITY GAP (planted): builds a RegExp directly from user input.
// This allows ReDoS (catastrophic backtracking) from a crafted `q`.
router.get('/tasks/search', (req: Request, res: Response) => {
  const q = String(req.query.q ?? '');
  const pattern = new RegExp(q);
  const results = getAllTasks().filter((t) => pattern.test(t.title));
  return res.json(results);
});
