// export class NotificationError { ... }
export class NotificationError {
  // O Map armazena chaves como 'name', 'address.street', 'root' ou 'Mensagem Global'
  // e valores como string[] para erros de campo, ou string para mensagens globais
  private errors = new Map<string, string[] | string>();

  /**
   * Adiciona uma mensagem de erro para um campo específico ou como erro global.
   * @param message A mensagem de erro.
   * @param field Opcional. O nome do campo associado ao erro (ex: 'name', 'address.street').
   */
  addError(message: string, field?: string) {
    const key = field || message; // Se não houver campo, a mensagem se torna a chave

    const currentErrors = this.errors.get(key);
    let errorsArray: string[];

    // Se o valor atual é uma string (erro global antigo) ou undefined, inicializa como array
    if (typeof currentErrors === 'string' || currentErrors === undefined) {
      errorsArray = currentErrors ? [currentErrors] : []; // Converte string existente em array
    } else {
      // Já é um string[], usa diretamente
      errorsArray = currentErrors;
    }

    // Adiciona a mensagem se não for duplicada
    if (errorsArray.indexOf(message) === -1) {
      errorsArray.push(message);
    }
    this.errors.set(key, errorsArray); // Garante que o valor no Map é sempre string[] para campos
  }

  /**
   * Retorna os erros para um campo específico ou todos os erros.
   * @param field Opcional. O campo para buscar erros.
   * @returns Um array de strings com as mensagens de erro.
   */
  getErrors(field?: string): string[] {
    if (field) {
      const value = this.errors.get(field);
      return typeof value === 'string' ? [value] : value || [];
    }
    const allErrors: string[] = [];
    this.errors.forEach((value) => {
      if (typeof value === 'string') {
        allErrors.push(value);
      } else {
        allErrors.push(...value);
      }
    });
    return allErrors;
  }

  /**
   * Define um(ns) erro(s) para um campo, sobrescrevendo os existentes.
   * @param error Uma string ou array de strings com a(s) mensagem(ns) de erro.
   * @param field Opcional. O campo associado.
   */
  setError(error: string | string[], field?: string) {
    if (field) {
      this.errors.set(field, Array.isArray(error) ? error : [error]);
    } else {
      // Para erros globais sem campo, se for array, adiciona cada como chave/valor
      if (Array.isArray(error)) {
        error.forEach((value) => {
          this.errors.set(value, value); // key = value, value = value
        });
      } else {
        this.errors.set(error, error); // key = error, value = error
      }
    }
  }

  /**
   * Verifica se há erros para um campo específico ou no geral.
   * @param field Opcional. O campo para verificar.
   * @returns True se houver erros, false caso contrário.
   */
  hasErrors(field?: string): boolean {
    if (field) return this.errors.has(field);

    return this.errors.size > 0;
  }

  /**
   * Copia erros de outra instância de NotificationError.
   * Agora lida com a estrutura de objeto aninhado.
   * @param notification A instância de NotificationError de onde copiar.
   */
  copyErrors(notification: NotificationError) {
    const sourceErrors = notification.errorsAsObject(); // Pega a estrutura aninhada

    // Função recursiva para copiar erros aninhados
    const copyNested = (
      sourceObj: Record<string, any>,
      currentPath: string[] = [],
    ) => {
      for (const key in sourceObj) {
        // Usa Object.prototype.hasOwnProperty.call para segurança (eslint)
        if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
          const fullPath = [...currentPath, key];
          const value = sourceObj[key];

          if (Array.isArray(value)) {
            // Se é um array, são mensagens de erro, então adicione-as ao nosso Map
            this.setError(value, fullPath.join('.')); // Converte o path em string para setError
          } else if (typeof value === 'object' && value !== null) {
            // Se é um objeto, é um nível aninhado, recurse
            copyNested(value, fullPath);
          }
        }
      }
    };

    copyNested(sourceErrors); // Inicia a cópia a partir da raiz
  }

  /**
   * Retorna os erros em um formato de objeto aninhado,
   * onde as chaves refletem a estrutura do campo (ex: { address: { street: ['msg'] } }).
   * @returns Um objeto Record<string, any> com os erros aninhados.
   */
  public errorsAsObject(): Record<string, any> {
    const result: Record<string, any> = {};

    this.errors.forEach((value, key) => {
      const parts = key.split('.'); // Divide 'address.street' em ['address', 'street']
      let currentLevel = result;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i === parts.length - 1) {
          // Última parte, é onde a mensagem de erro deve ir
          // Garante que o valor é tratado como array de strings
          const errorMessages = typeof value === 'string' ? [value] : value;

          // Se o target for string (erro global de chave igual ao path), ou não for array, inicializa
          if (!Array.isArray(currentLevel[part])) {
            currentLevel[part] = [];
          }
          currentLevel[part].push(...errorMessages);
        } else {
          // Não é a última parte, navegamos ou criamos o objeto aninhado
          if (
            !currentLevel[part] ||
            typeof currentLevel[part] !== 'object' ||
            Array.isArray(currentLevel[part])
          ) {
            currentLevel[part] = {}; // Cria o objeto aninhado se não existir ou for de tipo errado
          }
          currentLevel = currentLevel[part];
        }
      }
    });
    return result;
  }

  /**
   * Converte os erros para uma representação JSON.
   * Atualmente retorna um array plano. Pode ser ajustado para aninhado se necessário.
   * @returns Um array com as mensagens de erro ou objetos de erro.
   */
  toJSON() {
    const errors: Array<string | { [key: string]: string[] }> = [];
    this.errors.forEach((value, key) => {
      // Para manter a saída original que você tinha,
      // que produz um array plano com objetos para erros de campo
      if (typeof value === 'string') {
        errors.push(value);
      } else {
        errors.push({ [key]: value });
      }
    });
    return errors;
  }
}
