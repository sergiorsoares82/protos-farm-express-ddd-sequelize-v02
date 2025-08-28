// eslint.config.js

// 1. Importações
import js from '@eslint/js'; // Importa as configurações padrão do ESLint para JavaScript. Essencial para 'js.configs.recommended'.
import globals from 'globals'; // Biblioteca para importar facilmente conjuntos de variáveis globais (node, browser, etc.).
import tseslint from 'typescript-eslint'; // Pacote principal do TypeScript ESLint para Flat Config.
import prettierPlugin from 'eslint-plugin-prettier'; // Plugin que roda o Prettier como uma regra ESLint.
import { defineConfig } from 'eslint/config'; // Função auxiliar do ESLint para definir a configuração, melhora a tipagem e validação.

// 2. Exportação da Configuração
// O 'defineConfig' é uma função utilitária que ajuda o VS Code e o TypeScript a entenderem a estrutura
// esperada da configuração, fornecendo autocompletar e validação de tipos, o que provavelmente resolveu
// o problema de tipagem que você estava vendo anteriormente.
export default defineConfig([
  // Cada objeto dentro deste array é uma "camada" de configuração.
  // Elas são aplicadas em ordem, e as configurações posteriores podem sobrescrever as anteriores.

  // --- Camada 1: Ignorados ---
  {
    // Define os padrões de arquivos e diretórios que o ESLint deve ignorar.
    // Substitui o antigo `.eslintignore`.
    ignores: ['**/dist/**', '**/node_modules/**', 'coverage/**'],
  },

  // --- Camada 2: Configurações JavaScript Base (para todos os arquivos JS/TS) ---
  {
    // Aplica esta configuração a todos os arquivos JavaScript e TypeScript (e seus equivalentes 'mjs', 'cjs', 'mts', 'cts').
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    // Declara explicitamente o plugin 'js' (que vem de '@eslint/js') para poder usar suas configurações.
    plugins: { js },
    // Estende as regras recomendadas do plugin 'js'.
    // Isso é análogo a 'eslint:recommended' nas configurações antigas.
    extends: ['js/recommended'],
  },

  // --- Camada 3: Definição de Variáveis Globais ---
  {
    // Aplica esta configuração aos mesmos tipos de arquivo da Camada 2.
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      // Define as variáveis globais para ambientes de navegador.
      // Se você também tiver código Node.js, considere adicionar 'globals.node' ou criar um 'overrides'
      // específico para arquivos Node.js.
      globals: globals.browser,
      // Para projetos Node.js, você poderia ter: globals: { ...globals.node, ...globals.jest }
      // Para projetos com ambos (frontend/backend), o ideal seria um override com `files: ['src/backend/**/*.ts']` e `globals: globals.node`.
    },
  },

  // --- Camada 4: Configurações Recomendadas do TypeScript ESLint ---
  // Este é um array de configurações fornecido pelo `typescript-eslint`.
  // Ele já inclui o parser TypeScript e as regras recomendadas para TS.
  // Como é um array, ele é espalhado aqui para adicionar suas configurações individuais.
  ...tseslint.configs.recommended,

  // --- Camada 5: Regras TypeScript e Prettier Personalizadas ---
  {
    // Aplica esta configuração especificamente a arquivos TypeScript.
    files: ['**/*.ts'],
    languageOptions: {
      // Define o parser para arquivos TypeScript. Embora 'tseslint.configs.recommended' já faça isso,
      // explicitá-lo aqui garante que esta camada use o parser correto.
      parser: tseslint.parser,
      // Se suas regras TS dependem de análise de tipos (como regras sobre tipos explícitos),
      // você precisaria adicionar:
      // parserOptions: {
      //   project: './tsconfig.json',
      //   tsconfigRootDir: import.meta.dirname, // Importante para TS v5+ com Node Modules
      // },
      // O 'import.meta.dirname' precisa que o 'package.json' tenha "type": "module" ou você esteja usando 'mjs'.
      // Caso contrário, use `__dirname` e certifique-se de que o arquivo seja `.cjs` ou `.js` com "type": "commonjs".
      // Se o 'project' não estiver definido, algumas regras `@typescript-eslint` que requerem análise de tipo não funcionarão.
    },
    // Declara os plugins usados nesta camada.
    plugins: {
      '@typescript-eslint': tseslint.plugin, // O plugin de regras TypeScript.
      prettier: prettierPlugin, // O plugin Prettier.
    },
    rules: {
      // Suas regras personalizadas.
      // 'error' significa que o ESLint irá falhar se esta regra for violada.
      // 'warn' significa que o ESLint irá apenas avisar.
      '@typescript-eslint/no-unused-vars': [
        'error', // Marca como erro
        {
          argsIgnorePattern: '^_', // Ignora argumentos de função que começam com underscore.
          varsIgnorePattern: '^_', // Ignora variáveis que começam com underscore.
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // Desativa a exigência de tipo de retorno explícito para funções.
      'prettier/prettier': 'error', // Roda o Prettier e reporta quaisquer diferenças de formatação como erros do ESLint.
      '@typescript-eslint/no-empty-object-type': 'off', // Desativa a regra que impede tipos de objeto vazios.
      '@typescript-eslint/no-explicit-any': 'off', // Desativa a regra que impede o uso de 'any'. (Use com cautela!)
    },
  },
  // --- Camada 6 (OPCIONAL mas RECOMENDADA): Configuração Prettier para Desativar Conflitos ---
  // Esta parte foi omitida no seu código, mas é crucial para evitar conflitos entre ESLint e Prettier.
  // O `eslint-config-prettier` desabilita todas as regras do ESLint que são puramente de formatação
  // e que podem entrar em conflito com o Prettier.
  // É importante que essa configuração venha DEPOIS de todas as outras regras do ESLint
  // para que ela possa desabilitar as regras que foram definidas anteriormente.
  // Isso garante que apenas o Prettier seja responsável pela formatação.
  // Adicione:
  // configPrettier // se tiver importado 'configPrettier from 'eslint-config-prettier''
]);
