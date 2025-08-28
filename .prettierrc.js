// .prettierrc.js
// Este arquivo será tratado como um ES Module por causa de "type": "module" no package.json
export default {
  semi: true, // Adiciona ponto e vírgula no final das declarações
  singleQuote: true, // Usa aspas simples em vez de duplas
  trailingComma: 'all', // Adiciona vírgulas no final de objetos e arrays (ES5, None, All)
  printWidth: 80, // Quebra a linha quando atingir 80 caracteres
  tabWidth: 2, // 2 espaços para indentação
  endOfLine: 'lf', // Padrão de quebra de linha ('lf' para Linux/macOS, 'crlf' para Windows)
  arrowParens: 'always', // Sempre incluir parênteses em torno de um único parâmetro de função de seta
};
