import { ValueObject } from '../value-object';

describe('Value Object Unit Test', () => {
  class SimpleStubValueObject extends ValueObject {
    constructor(private prop1: string) {
      super();
    }
  }

  class ComplexStubValueObject extends ValueObject {
    constructor(
      private prop1: string,
      private prop2: number,
    ) {
      super();
    }
  }

  it('should return true for identical instances of the same VO type', () => {
    const svo = new SimpleStubValueObject('value');
    expect(svo.equals(svo)).toBe(true);

    const cvo = new ComplexStubValueObject('value', 123);
    expect(cvo.equals(cvo)).toBe(true);
  });
  it('should return true for different instances with same values of the same VO type', () => {
    const svo1 = new SimpleStubValueObject('value');
    const svo2 = new SimpleStubValueObject('value');
    expect(svo1.equals(svo2)).toBe(true);

    const cvo1 = new ComplexStubValueObject('value', 123);
    const cvo2 = new ComplexStubValueObject('value', 123);
    expect(cvo1.equals(cvo2)).toBe(true);
  });

  it('should return false for different instances with different values of the same VO type', () => {
    const svo1 = new SimpleStubValueObject('value');
    const svo2 = new SimpleStubValueObject('different');
    expect(svo1.equals(svo2)).toBe(false);
  });

  it('should return false when comparing to null or undefined', () => {
    const svo = new SimpleStubValueObject('value');
    expect(svo.equals(null as any)).toBe(false);
    expect(svo.equals(undefined as any)).toBe(false);
  });
});
