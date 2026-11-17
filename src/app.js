// Configura o Express (a ordem importa!).
import express from 'express';
import routes from './routes/index.js';
import { AppError } from './errors/AppError.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json()); // permite ler JSON enviado no corpo (req.body)
app.use(routes); // rotas da API

// Se nenhuma rota respondeu, a rota não existe (404)
app.use((req, res, next) => {
  next(new AppError('Rota não encontrada.', 404));
});

app.use(errorHandler); // sempre por último

export default app;
