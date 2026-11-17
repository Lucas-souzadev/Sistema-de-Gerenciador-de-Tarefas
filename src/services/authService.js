// SERVICE: regras de cadastro e login.
const textoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { novoUsuario, usuarioPublico } from '../models/User.js';
import * as userRepository from '../repositories/userRepository.js';

export function cadastrar(dados) {
  if (!textoValido(dados.nome) || !textoValido(dados.email) || !textoValido(dados.senha)) {
    throw new AppError('Nome, e-mail e senha são obrigatórios.', 400);
  }
  if (dados.senha.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400);
  }

  const email = dados.email.trim().toLowerCase();
  if (userRepository.buscarPorEmail(email)) {
    throw new AppError('Já existe um usuário com este e-mail.', 409);
  }

  const senhaHash = bcrypt.hashSync(dados.senha, 10); // guarda só o hash, nunca a senha
  // O perfil é sempre "USER" no cadastro público (ignora qualquer "perfil" enviado).
  const usuario = novoUsuario(dados.nome.trim(), email, senhaHash, 'USER');
  userRepository.salvar(usuario);
  return usuarioPublico(usuario);
}

export function login(dados) {
  if (!textoValido(dados.email) || !textoValido(dados.senha)) {
    throw new AppError('Informe e-mail e senha.', 400);
  }

  const usuario = userRepository.buscarPorEmail(dados.email.trim().toLowerCase());
  if (!usuario || !bcrypt.compareSync(dados.senha, usuario.senhaHash)) {
    throw new AppError('E-mail ou senha inválidos.', 401);
  }

  // Gera o token JWT guardando o id e o perfil do usuário.
  const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
  return { token, usuario: usuarioPublico(usuario) };
}

// Cria o ADMIN usando os dados do arquivo .env (não existe cadastro público de admin).
export function criarAdminPadrao() {
  const email = process.env.ADMIN_EMAIL;
  const senha = process.env.ADMIN_SENHA;

  if (!email || !senha) {
    console.log('ADMIN_EMAIL e ADMIN_SENHA não definidos: nenhum admin foi criado.');
    return;
  }
  if (userRepository.buscarPorEmail(email.toLowerCase())) {
    return; // já existe
  }

  const admin = novoUsuario('Administrador', email.toLowerCase(), bcrypt.hashSync(senha, 10), 'ADMIN');
  userRepository.salvar(admin);
  console.log('Usuário admin criado:', email);
}
