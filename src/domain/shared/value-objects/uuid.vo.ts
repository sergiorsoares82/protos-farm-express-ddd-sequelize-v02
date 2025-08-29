import { ValueObject } from '../value-object';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

export class InvalidUuidError extends Error {
  constructor(message: string = 'Invalid UUID') {
    super(message);
    this.name = 'InvalidUuidError';
  }
}

export class Uuid extends ValueObject {
  // Propriedade interna para armazenar o ID.
  // Marcada como 'private' e 'readonly' para imutabilidade e encapsulamento.
  private readonly _id: string;

  protected constructor(id: string) {
    super(); // Chama o construtor de ValueObject
    this._id = id;
    this.validate(id);
  }

  /**
   * Método estático de fábrica para criar um Uuid a partir de uma string existente.
   * Valida a string fornecida.
   * @param id A string UUID a ser validada e encapsulada.
   * @returns Uma nova instância de Uuid.
   * @throws InvalidUuidError se a string não for um UUID válido.
   */
  static create(id: string): Uuid {
    return new Uuid(id);
  }

  /**
   * Método estático de fábrica para gerar um novo Uuid.
   * @returns Uma nova instância de Uuid com um ID gerado aleatoriamente (v4).
   */
  static generate(): Uuid {
    return new Uuid(uuidV4());
  }

  /**
   * Getter público para acessar a string do UUID.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Valida se a string fornecida é um UUID válido.
   * Este método é interno e chamado pelo construtor.
   * @param id A string a ser validada.
   * @throws InvalidUuidError se a string não for um UUID válido.
   */
  private validate(id: string): void {
    const isValid = uuidValidate(id);
    if (!isValid) {
      throw new InvalidUuidError(`Invalid UUID: "${id}"`);
    }
  }

  /**
   * Retorna a representação em string do UUID.
   * Útil para serialização ou quando a string é necessária diretamente.
   */
  toString(): string {
    return this._id;
  }
}
