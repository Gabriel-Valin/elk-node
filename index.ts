import './apm'

import express, { Request, Response } from 'express';
import { authenticateJWT } from './auth';
import { userContext } from './apm-middleware';
import { error, log } from './logger';
import { TASKS_APM_OPERATIONS } from './operation-enum';

const app = express();
const port = 3000;

let tasks: { id: number, task: string }[] = [];
let nextTaskId = 1;

app.use(express.json());

app.get('/tasks', authenticateJWT, userContext, (req: Request, res: Response) => {
  res.json(tasks);
});

app.get('/tasks/:id', authenticateJWT, userContext, (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

app.post('/tasks', authenticateJWT, userContext, (req: Request, res: Response) => {
  const { task } = req.body;
  if (task === 'notwork') {
    error(new Error('Falha na criacao'), TASKS_APM_OPERATIONS.CREATE)
    res.status(400).send('Erro: Bad Request');
  }

  if (task) {
    const newTask = { id: nextTaskId++, task };
    tasks.push(newTask);
    log(`Tarefa inserida com sucesso, ID: ${nextTaskId}`, TASKS_APM_OPERATIONS.CREATE, { task })
    res.status(201).json(newTask);
  }

  if (!task) {
    res.status(400).send('Erro: Nenhuma tarefa fornecida.');
  }
});

app.put('/tasks/:id', authenticateJWT, userContext, (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const { task: updatedTask } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1 && updatedTask) {
    tasks[taskIndex].task = updatedTask;
    res.status(200).send('Tarefa atualizada com sucesso.');
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

app.delete('/tasks/:id', authenticateJWT, userContext, (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(200).send('Tarefa excluída com sucesso.');
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});