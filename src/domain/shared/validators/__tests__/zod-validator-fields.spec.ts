import z from 'zod';
import { ZodValidatorFields } from '../zod-validator-fields';
import { NotificationError } from '../notification';

class TestNotificationError extends NotificationError {
  constructor() {
    super();
  }
}

class UserSchemaTest extends ZodValidatorFields {
  schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Invalid email format'),
    age: z.number().int().positive('Age must be a positive integer').optional(),
  });
}

describe('ZodValidatorFields Unit Tests', () => {
  let validator: UserSchemaTest;
  let notification: TestNotificationError;

  beforeEach(() => {
    validator = new UserSchemaTest();
    notification = new TestNotificationError();
  });

  it('should return true and no errors for valid data', () => {
    const data = { name: 'John Doe', email: 'john@example.com', age: 30 };
    const isValid = validator.validate(notification, data);

    expect(isValid).toBe(true);
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();
  });

  it('should return false and add errors for invalid data', () => {
    const data = { name: 'Jo', email: 'invalid-email', age: -5 };
    const isValid = validator.validate(notification, data);

    expect(isValid).toBe(false);
    expect(notification.hasErrors()).toBe(true);
    expect(notification.errorsAsObject()).toEqual({
      name: ['Name must be at least 3 characters'],
      email: ['Invalid email format'],
      age: ['Age must be a positive integer'],
    });
    expect(validator.errors).toEqual(notification.errorsAsObject());
  });

  it('should validate specific fields when `fields` array is provided', () => {
    const data = { name: 'Jo', email: 'valid@example.com' }; // Name is invalid
    const isValid = validator.validate(notification, data, ['email']);

    expect(isValid).toBe(true); // Should be valid because only email was checked and it's valid
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();

    // Now, validate the invalid field
    notification = new TestNotificationError(); // Reset notification
    const isValidName = validator.validate(notification, data, ['name']);
    expect(isValidName).toBe(false);
    expect(notification.hasErrors()).toBe(true);
    expect(notification.errorsAsObject()).toEqual({
      name: ['Name must be at least 3 characters'],
    });
    expect(validator.errors).toEqual(notification.errorsAsObject());
  });

  it('should validate all fields if `fields` array is empty', () => {
    const data = { name: 'Jo', email: 'invalid-email' };
    const isValid = validator.validate(notification, data, []); // Empty array, full validation

    expect(isValid).toBe(false);
    expect(notification.hasErrors()).toBe(true);
    expect(notification.errorsAsObject()).toEqual({
      name: ['Name must be at least 3 characters'],
      email: ['Invalid email format'],
    });
    expect(validator.errors).toEqual(notification.errorsAsObject());
  });

  it('should clear errors on subsequent successful validation', () => {
    // First, an invalid validation
    validator.validate(notification, { name: 'J' });
    expect(validator.errors).not.toBeNull();

    // Then, a valid validation
    notification = new TestNotificationError(); // Reset notification
    const isValid = validator.validate(notification, {
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(isValid).toBe(true);
    expect(validator.errors).toBeNull(); // Errors should be cleared
  });

  it('should handle data with extra properties not in schema', () => {
    const data = {
      name: 'Valid Name',
      email: 'valid@example.com',
      extraField: 'should be ignored',
    };
    const isValid = validator.validate(notification, data);
    expect(isValid).toBe(true);
    expect(notification.hasErrors()).toBe(false);
  });

  it('should handle partial data when schema fields are optional', () => {
    const data = { name: 'John Doe', email: 'john@example.com' }; // Age is optional
    const isValid = validator.validate(notification, data);
    expect(isValid).toBe(true);
    expect(notification.hasErrors()).toBe(false);
  });
});
