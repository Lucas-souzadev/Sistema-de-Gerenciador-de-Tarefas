// Ponto de entrada: carrega o .env, cria o admin e liga o servidor.
import 'dotenv/config'; // precisa ser o primeiro import
import app from './app.js';
import { criarAdminPadrao } from './services/authService.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET não definido. Copie o arquivo .env.example para .env.');
  process.exit(1);
}

criarAdminPadrao();

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`);
});
