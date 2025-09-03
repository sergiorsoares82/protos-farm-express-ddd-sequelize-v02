import { validate } from 'uuid';
import { InvalidUuidError, Uuid } from '../../shared/value-objects/uuid.vo';
import {
  PersonEntity,
  PersonId,
  type PersonConstructorProps,
} from '../person.entity';

describe('PersonEntity Tests', () => {
  describe('PersonId', () => {
    it('should throw an error if the UUID is invalid', () => {
      expect(() => PersonId.create('invalid-uuid')).toThrow(InvalidUuidError);
    });
    it('should create a valid PersonId', () => {
      const personId = PersonId.create('550e8400-e29b-41d4-a716-446655440000');
      expect(personId).toBeInstanceOf(Uuid);
    });
    it('should generate a valid PersonId', () => {
      const personId = PersonId.generate();
      expect(personId).toBeInstanceOf(Uuid);
    });
  });
  describe('constructor', () => {
    it('should build a person entity with basic properties', () => {
      const props: PersonConstructorProps = {
        name: 'John Doe',
        person_type: 'física',
      };
      const person = new PersonEntity(props);
      expect(person).toBeInstanceOf(PersonEntity);
      expect(person.person_id).toBeDefined();
      expect(person.person_id).toBeInstanceOf(Uuid);
      // expect(person.person_id).toBeInstanceOf(PersonId);
      expect(person.toJSON()).toEqual({
        person_id: person.person_id.id,
        name: person.name,
        person_type: person.person_type,
        created_at: person.created_at,
        updated_at: person.updated_at,
      });
      expect(person.created_at.getTime()).toBeLessThanOrEqual(
        person.updated_at.getTime(),
      );
      expect(person.notificationError.hasErrors()).toBe(false);
    });
    it('should build a person entity with all properties', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person).toBeInstanceOf(PersonEntity);
      expect(person.person_id).toBeDefined();
      expect(person.person_id).toBeInstanceOf(Uuid);
      // expect(person.person_id).toBeInstanceOf(PersonId);
      expect(validate(person.person_id.id)).toBe(true);
      expect(person.toJSON()).toEqual({
        person_id: person.person_id.id,
        name: person.name,
        person_type: person.person_type,
        created_at: person.created_at,
        updated_at: person.updated_at,
      });
      expect(person.created_at.getTime()).toBeLessThanOrEqual(
        person.updated_at.getTime(),
      );
    });
    it('should add error to notification when props are invalid', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'J',
        person_type: 'unknown' as any,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const person = new PersonEntity(props);

      expect(person.notificationError.hasErrors()).toBe(true);
      expect(person.notificationError.getErrors()).toEqual([
        'Too small: expected string to have >=2 characters',
        'Invalid option: expected one of "física"|"jurídica"',
      ]);
    });
  });
  describe('create', () => {
    it('should create a person entity with valid props', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = PersonEntity.create(props);
      expect(person).toBeInstanceOf(PersonEntity);
      expect(person.person_id).toBeDefined();
      expect(person.person_id).toBeInstanceOf(Uuid);
      expect(validate(person.person_id.id)).toBe(true);
      expect(person.toJSON()).toEqual({
        person_id: person.person_id.id,
        name: person.name,
        person_type: person.person_type,
        created_at: person.created_at,
        updated_at: person.updated_at,
      });
      expect(person.created_at.getTime()).toBeLessThanOrEqual(
        person.updated_at.getTime(),
      );
    });
    it('should create a person entity with valid props and without optional fields', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
      };
      const person = PersonEntity.create(props);
      expect(person).toBeInstanceOf(PersonEntity);
      expect(person.person_id).toBeDefined();
      expect(person.person_id).toBeInstanceOf(Uuid);
      expect(validate(person.person_id.id)).toBe(true);
      expect(person.toJSON()).toEqual({
        person_id: person.person_id.id,
        name: person.name,
        person_type: person.person_type,
        created_at: person.created_at,
        updated_at: person.updated_at,
      });
      expect(person.created_at.getTime()).toBeLessThanOrEqual(
        person.updated_at.getTime(),
      );
    });
    it('should add error to notification when props are undefined', () => {
      const props: any = {
        person_id: PersonId.generate(),
      };

      const person = new PersonEntity(props);

      expect(person.notificationError.hasErrors()).toBe(true);
      expect(person.notificationError.getErrors()).toEqual([
        'Invalid input: expected string, received undefined',
        'Invalid option: expected one of "física"|"jurídica"',
      ]);
    });
    it('should add error to notification when props are invalid', () => {
      const props: any = {
        person_id: PersonId.generate(),
        name: 'J',
        person_type: 'unknown' as any,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const person = new PersonEntity(props);

      expect(person.notificationError.hasErrors()).toBe(true);
      expect(person.notificationError.getErrors()).toEqual([
        'Too small: expected string to have >=2 characters',
        'Invalid option: expected one of "física"|"jurídica"',
      ]);
    });
  });
  describe('properties getters', () => {
    it('should get entity_id', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);

      expect(person.person_id).toBe(props.person_id);
      expect(person.entity_id).toBe(props.person_id);
    });
    it('should get name', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.person_id).toBe(props.person_id);
    });
    it('should get name', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.name).toBe(props.name);
    });
    it('should get person_type', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.person_type).toBe(props.person_type);
    });
    it('should get created_at', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.created_at).toBe(props.created_at);
    });
    it('should get updated_at', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.updated_at).toBe(props.updated_at);
    });
  });
  describe('toJSON', () => {
    it('should return a JSON representation of the person entity', () => {
      const props: PersonConstructorProps = {
        person_id: PersonId.generate(),
        name: 'John Doe',
        person_type: 'física',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const person = new PersonEntity(props);
      expect(person.toJSON()).toEqual({
        person_id: props.person_id,
        name: props.name,
        person_type: props.person_type,
        created_at: props.created_at,
        updated_at: props.updated_at,
      });
    });
  });
});
