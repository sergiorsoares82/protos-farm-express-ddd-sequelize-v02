import { ValueObject } from '../../value-object';
import { InvalidUuidError, Uuid } from '../uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('Uuid Unit Tests', () => {
  const validUuidString = 'a1b2c3d4-e5f6-4789-a012-345678abcdef';
  describe('Uuid generate', () => {
    it('should generate a valid UUID', () => {
      const uuid = Uuid.generate();
      expect(uuid).toBeDefined();
      expect(uuidValidate(uuid.id)).toBe(true);
    });

    it('should generate different UUIDs on successive calls', () => {
      const uuid1 = Uuid.generate();
      const uuid2 = Uuid.generate();
      expect(uuid1).toBeDefined();
      expect(uuid2).toBeDefined();
      expect(uuid1.id).not.toBe(uuid2.id);
    });
  });
  describe('Uuid create', () => {
    it('should create a Uuid from a valid string', () => {
      const uuid = Uuid.create(validUuidString);
      expect(uuid).toBeDefined();
      expect(uuid).toBeInstanceOf(Uuid);
      expect(uuid.id).toBe(validUuidString);
      expect(uuidValidate(uuid.id)).toBe(true);
    });
    it('should throw InvalidUuidError for an invalid string', () => {
      const invalidUuidString = 'invalid-uuid-string';
      expect(() => Uuid.create(invalidUuidString)).toThrow(InvalidUuidError);
      expect(() => Uuid.create(invalidUuidString)).toThrow(
        `Invalid UUID: "${invalidUuidString}"`,
      );
    });
    it('should throw InvalidUuidError for an empty string', () => {
      expect(() => Uuid.create('')).toThrow(InvalidUuidError);
    });
    it('should throw InvalidUuidError for a null or undefined string (typescript handles some of this, but good to test)', () => {
      // Para testar null/undefined, você pode precisar ignorar o tipo do TS
      expect(() => Uuid.create(null as any)).toThrow(InvalidUuidError);
      expect(() => Uuid.create(undefined as any)).toThrow(InvalidUuidError);
    });
  });
  describe('Uuid getter id', () => {
    it('should return the correct id', () => {
      const uuid = Uuid.create(validUuidString);
      expect(uuid.id).toBe(validUuidString);
    });
  });
  describe('Uuid toString', () => {
    it('should return the correct string representation', () => {
      const uuid = Uuid.create(validUuidString);
      expect(uuid.toString()).toBe(validUuidString);
    });
  });
  describe('equals method (inherited from ValueObject)', () => {
    it('should return true for two Uuid instances with the same id', () => {
      const uuid1 = Uuid.create(validUuidString);
      const uuid2 = Uuid.create(validUuidString);
      expect(uuid1.equals(uuid2)).toBe(true);
    });
    it('should return true for a Uuid instance compared to itself', () => {
      const uuid = Uuid.generate();
      expect(uuid.equals(uuid)).toBe(true);
    });
    it('should return false for two Uuid instances with different ids', () => {
      const uuid1 = Uuid.generate();
      const uuid2 = Uuid.generate();
      expect(uuid1.equals(uuid2)).toBe(false);
    });
    it('should return false when comparing to null or undefined', () => {
      const uuid = Uuid.generate();
      expect(uuid.equals(null as any)).toBe(false);
      expect(uuid.equals(undefined as any)).toBe(false);
    });
    it('should return false when comparing to a different ValueObject type', () => {
      // Cria uma classe ValueObject de teste para garantir que a comparação de tipos funcione
      class AnotherValueObject extends ValueObject {
        constructor(readonly value: string) {
          super();
        }
      }

      const uuid = Uuid.generate();
      const anotherVo = new AnotherValueObject(uuid.id); // Mesmo valor, mas tipo diferente

      // Embora o valor interno seja o mesmo, o tipo é diferente, então should ser false
      expect(uuid.equals(anotherVo as any)).toBe(false);
      expect(anotherVo.equals(uuid as any)).toBe(false);
    });
  });
  describe('InvalidUuidError', () => {
    it('should be an instance of Error', () => {
      const error = new InvalidUuidError();
      expect(error).toBeInstanceOf(Error);
    });
    it('should have the correct name property', () => {
      const error = new InvalidUuidError();
      expect(error.name).toBe('InvalidUuidError');
    });
    it('should accept a custom message', () => {
      const customMessage = 'This is a custom UUID error.';
      const error = new InvalidUuidError(customMessage);
      expect(error.message).toBe(customMessage);
    });
    it('should have a default message if none is provided', () => {
      const error = new InvalidUuidError();
      expect(error.message).toBe('Invalid UUID');
    });
  });
});
