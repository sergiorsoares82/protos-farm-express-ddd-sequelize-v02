import { ZodValidatorFields } from '../shared/validators/zod-validator-fields';
import { PersonStateSchema } from './person.entity';

export class PersonValidator extends ZodValidatorFields {
  schema = PersonStateSchema;
}

export class PersonValidatorFactory {
  static create() {
    return new PersonValidator();
  }
}
