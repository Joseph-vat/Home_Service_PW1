type PrestadorServico = {
  id: String;
  nome: String;
  email: String;
  senha: String;
  telefone: String;
  endereco: String;
  foto: String;
}

type PrestadorServico = {
    id: Int;
    nome: String;
    email: String;
    telefone: String;
    endereco: String;
    foto: String;
}

declare namespace Express{
    export interface Request{
      userExpr: Usuario;
    }
  }