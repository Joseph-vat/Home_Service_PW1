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

  //Mudanças: Danrlei criar um type Cliente e fazer essa parte declare namespace para exportar o tipo cliente