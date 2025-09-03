import { NotificationError } from './validators/notification';
import type { Uuid } from './value-objects/uuid.vo';

export abstract class Entity<T extends Uuid> {
  protected _createdAt: Date;
  protected _updatedAt: Date;
  notificationError: NotificationError = new NotificationError();

  /**
   * Construtor da classe Entity.
   * Inicializa automaticamente as datas de criação e última atualização.
   */
  constructor() {
    this._createdAt = new Date(); // Define a data de criação no momento da instanciação
    this._updatedAt = new Date(); // Define a data de atualização também no momento da instanciação
  }

  /**
   * Retorna a data de criação da entidade.
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Retorna a data da última atualização da entidade.
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Método abstrato para obter o identificador único da entidade.
   * Deve ser implementado pelas subclasses.
   */
  abstract get entity_id(): T;

  /**
   * Método abstrato para serializar a entidade em formato JSON.
   * Deve ser implementado pelas subclasses para definir a representação JSON da entidade.
   */
  abstract toJSON(): any;

  /**
   * Método auxiliar para atualizar a data de modificação da entidade.
   * Pode ser chamado internamente pela própria entidade ou por um serviço/repositório
   * ao persistir alterações.
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }
}
