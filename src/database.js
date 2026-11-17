// "Banco de dados": um arquivo JSON com tudo guardado dentro dele.
// Formato:  { "users": [], "projects": [], "tasks": [] }
import fs from 'node:fs';

function caminhoDoArquivo() {
  return process.env.DB_FILE || 'data/db.json';
}

// Lê o arquivo e devolve os dados como objeto JavaScript.
export function lerDados() {
  if (!fs.existsSync(caminhoDoArquivo())) {
    fs.mkdirSync('data', { recursive: true });
    salvarDados({ users: [], projects: [], tasks: [] });
  }
  const texto = fs.readFileSync(caminhoDoArquivo(), 'utf-8');
  return JSON.parse(texto);
}

// Escreve os dados no arquivo (é isso que faz os dados continuarem depois de reiniciar).
export function salvarDados(dados) {
  fs.writeFileSync(caminhoDoArquivo(), JSON.stringify(dados, null, 2));
}
