/** @type {import('jest').Config} */
const config = {
  // Garante que o Jest use o ambiente de teste do Node.js
  testEnvironment: 'node',
  // Configura o SWC como transpilador para arquivos .js e .ts (e .jsx/.tsx se você os usasse)
  transform: {
    '^.+.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    // Mapeia '@/*' para o diretório 'src/'
    // O '^@/(.*)$' é uma expressão regular que captura qualquer coisa após '@/'.
    // O '<rootDir>/src/$1' instrui o Jest a procurar o arquivo correspondente
    // dentro do diretório 'src' a partir da raiz do projeto (rootDir).
    // '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',

    // Exemplo: se você tivesse um alias para componentes:
    // '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
};

export default config;
