import { Entity } from '../shared/entity';
import { Uuid } from '../shared/value-objects/uuid.vo';
import z from 'zod';
import { PersonValidatorFactory } from './person.validator';

export class PersonId extends Uuid {}

// Schema para validação de entrada ao CRIAR uma pessoa
const PersonInputSchema = z.object({
  name: z.string().min(2).max(100),
  person_type: z.enum(['física', 'jurídica']),
});

// Schema para validação do ESTADO COMPLETO da entidade (incluindo ID e datas)
export const PersonStateSchema = PersonInputSchema.extend({
  person_id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Tipos inferidos
type PersonCreate = z.infer<typeof PersonInputSchema>;
type PersonState = Omit<z.infer<typeof PersonStateSchema>, 'person_id'> & {
  person_id: string;
};

// Props para o construtor (permite criar ou restaurar)
export type PersonConstructorProps = Omit<
  PersonState,
  'person_id' | 'created_at' | 'updated_at'
> & {
  person_id?: PersonId;
  created_at?: Date;
  updated_at?: Date;
};

export class PersonEntity extends Entity<PersonId> {
  readonly person_id: PersonId;
  private _name: string;
  private _person_type: 'física' | 'jurídica';
  readonly created_at: Date;
  private _updated_at: Date;

  constructor(props: PersonConstructorProps) {
    super();
    this.person_id = props.person_id ?? PersonId.generate();
    this.created_at = props.created_at ?? new Date();
    this._updated_at = props.updated_at ?? new Date();
    // Atribuição inicial das propriedades mutáveis
    this._name = props.name;
    this._person_type = props.person_type;

    // *** VALIDAÇÃO NO CONSTRUTOR ***
    this.validate();
  }

  static create(props: PersonCreate): PersonEntity {
    const person = new PersonEntity(props);
    return person;
  }

  get entity_id(): PersonId {
    return this.person_id;
  }

  get name(): string {
    return this._name;
  }

  get person_type(): 'física' | 'jurídica' {
    return this._person_type;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  private validate(): boolean {
    const validator = PersonValidatorFactory.create();
    return validator.validate(this.notificationError, this.toJSON());
  }

  toJSON(): PersonState {
    return {
      person_id: this.person_id.id,
      name: this._name,
      person_type: this._person_type,
      created_at: this.created_at,
      updated_at: this._updated_at,
    };
  }
}
