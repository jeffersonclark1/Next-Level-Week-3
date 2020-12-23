import { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";

interface ValidationErros {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  // Caso o erro seja de validação
  if (error instanceof ValidationError) {
    const errors: ValidationErros = {};

    // Percorre cada um dos erros e retorna os campos e seus respectivos erros
    error.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json({ message: "Validation fails", errors });
  }

  console.error(error); // exibido para o desenvolvedor

  // exibido para o usuário
  return response.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;