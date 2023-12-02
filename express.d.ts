type PrestadorServico = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  foto: string?
}

declare namespace Express{
    export interface Request{
      userExpr: PrestadorServico;
    }
  }

  declare namespace Express{
    export interface Request{
      autenticado: string;
    }
  }