import { NotificationError } from '../notification';

describe('Notification Unit Tests', () => {
  let notification: NotificationError;
  beforeEach(() => {
    notification = new NotificationError();
  });
  it('should be empty initially', () => {
    expect(notification.hasErrors()).toBe(false);
    expect(notification.getErrors()).toEqual([]);
  });
  describe('addError', () => {
    it('should add an error without field', () => {
      notification.addError('Error 1');
      expect(notification.hasErrors()).toBe(true);
      expect(notification.getErrors()).toEqual(['Error 1']);
      expect(notification.getErrors('field1')).toEqual([]);
    });
    it('should add an error with field', () => {
      notification.addError('Error 1', 'field1');
      expect(notification.hasErrors('field1')).toBe(true);
      expect(notification.getErrors('field1')).toEqual(['Error 1']);
      expect(notification.getErrors()).toEqual(['Error 1']);
    });
    it('should not add duplicate errors for the same field', () => {
      notification.addError('Name is required', 'name');
      notification.addError('Name is required', 'name');
      expect(notification.getErrors('name').length).toBe(1);
      expect(notification.getErrors('name')).toEqual(['Name is required']);
    });
    it('should add multiple unique errors for the same field', () => {
      notification.addError('Name is required', 'name');
      notification.addError('Name must be at least 3 characters', 'name');
      expect(notification.getErrors('name')).toEqual([
        'Name is required',
        'Name must be at least 3 characters',
      ]);
    });
  });
  describe('setError', () => {
    it('should set a general error, replacing previous ones if key matches', () => {
      notification.addError('Old general error');
      notification.setError('New general error'); // This creates a new key 'New general error'
      expect(notification.getErrors()).toContain('Old general error'); // Old one is still there
      expect(notification.getErrors()).toContain('New general error');
    });
    it('should set an array of general errors', () => {
      notification.setError(['Error A', 'Error B']);
      expect(notification.getErrors()).toEqual(['Error A', 'Error B']);
    });
    it('should set an error for a field, overwriting previous errors for that field', () => {
      notification.addError('Old name error 1', 'name');
      notification.addError('Old name error 2', 'name');
      notification.setError('New name error', 'name');
      expect(notification.getErrors('name')).toEqual(['New name error']);
      expect(notification.getErrors().length).toBe(1); // Only the new 'name' error
    });
    it('should set an array of errors for a field, overwriting previous errors for that field', () => {
      notification.addError('Old email error 1', 'email');
      notification.setError(
        ['New email error 1', 'New email error 2'],
        'email',
      );
      expect(notification.getErrors('email')).toEqual([
        'New email error 1',
        'New email error 2',
      ]);
    });
  });
  describe('getErrors', () => {
    it('should return all errors when no field is specified', () => {
      notification.addError('General error');
      notification.addError('Name required', 'name');
      notification.addError('Email invalid', 'email');
      expect(notification.getErrors()).toEqual([
        'General error',
        'Name required',
        'Email invalid',
      ]);
    });
    it('should return errors for a specific field', () => {
      notification.addError('Name required', 'name');
      notification.addError('Email invalid', 'email');
      expect(notification.getErrors('name')).toEqual(['Name required']);
      expect(notification.getErrors('email')).toEqual(['Email invalid']);
    });
    it('should return an empty array for a non-existent field', () => {
      notification.addError('General error');
      expect(notification.getErrors('nonExistentField')).toEqual([]);
    });
  });
  describe('hasErrors', () => {
    it('should return true if there are any errors', () => {
      notification.addError('An error');
      expect(notification.hasErrors()).toBe(true);
    });

    it('should return false if there are no errors', () => {
      expect(notification.hasErrors()).toBe(false);
    });
  });
  describe('copyErrors', () => {
    it('should copy errors from another notification instance', () => {
      const sourceNotification = new NotificationError();
      sourceNotification.addError('Error from source', 'field1');
      sourceNotification.addError('Another source error');

      notification.copyErrors(sourceNotification);

      expect(notification.hasErrors()).toBe(true);
      expect(notification.getErrors('field1')).toEqual(['Error from source']);
      expect(notification.getErrors()).toContain('Another source error');
    });
    it('should merge errors when copying to an existing notification', () => {
      notification.addError('Existing error', 'fieldA');
      notification.addError('Existing general');

      const sourceNotification = new NotificationError();
      sourceNotification.addError('New error', 'fieldB');
      sourceNotification.addError('Existing error', 'fieldA'); // This will overwrite fieldA if setError is used

      notification.copyErrors(sourceNotification);

      expect(notification.getErrors('fieldA')).toEqual(['Existing error']); // This depends on setError's behavior, expect it to be overwritten or merged based on your design.
      expect(notification.getErrors('fieldB')).toEqual(['New error']);
      expect(notification.getErrors()).toContain('Existing general');
    });
  });
  describe('errorsAsObject', () => {
    it('should convert errors to an object format correctly', () => {
      notification.addError('Invalid name', 'name');
      notification.addError('Invalid email', 'email');
      notification.addError('General issue');

      const errorsObj = notification.errorsAsObject();
      expect(errorsObj).toEqual({
        name: ['Invalid name'],
        email: ['Invalid email'],
        'General issue': ['General issue'], // Note: The general error acts as its own key
      });
    });
    it('should return an empty object if no errors', () => {
      expect(notification.errorsAsObject()).toEqual({});
    });
  });
  describe('toJSON', () => {
    it('should serialize errors to a JSON array format', () => {
      notification.addError('Password too short', 'password');
      notification.addError('User not found');

      const jsonResult = notification.toJSON();
      // The order of items in Map iteration is insertion order in modern JS environments, but
      // for safety, verify content not strict order if not explicitly guaranteed by spec.
      expect(jsonResult).toContainEqual({ password: ['Password too short'] });
      expect(jsonResult).toContainEqual('User not found');
      expect(jsonResult.length).toBe(2);
    });
    it('should return an empty array if no errors', () => {
      expect(notification.toJSON()).toEqual([]);
    });
  });
});
