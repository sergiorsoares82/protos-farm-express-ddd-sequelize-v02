/** @type {import('jest').Config} */
const config = {
  // Garante que o Jest use o ambiente de teste do Node.js
  testEnvironment: "node",
  // Configura o SWC como transpilador para arquivos .js e .ts (e .jsx/.tsx se você os usasse)
  transform: {
    "^.+.(t|j)sx?$": "@swc/jest",
  },
};

export default config;
