import { validate } from 'uuid';
import { Entity } from '../entity';
import { Uuid } from '../value-objects/uuid.vo';

class DummyUuid extends Uuid {}
class DummyEntity extends Entity<DummyUuid> {
  private _id: DummyUuid;
  public name: string;

  constructor(name: string = 'Dummy Name') {
    super();
    this._id = DummyUuid.generate();
    this.name = name;
  }

  get entity_id(): DummyUuid {
    return this._id;
  }

  toJSON(): any {
    return {
      id: this.entity_id.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public exposeTouch() {
    this.touch();
  }
}

describe('Entity', () => {
  let dummyEntity: DummyEntity;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T10:00:00Z'));
    dummyEntity = new DummyEntity();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a new entity with a unique ID', () => {
    const now = new Date('2023-01-01T10:00:00Z');
    expect(dummyEntity.createdAt).toEqual(now);
    expect(dummyEntity.updatedAt).toEqual(now);
  });

  it('should update updatedAt when touch is called', () => {
    const initialUpdatedAt = dummyEntity.updatedAt;
    jest.setSystemTime(new Date('2023-01-01T10:01:00Z')); // Avança o tempo
    dummyEntity.exposeTouch(); // Chamada ao método exposto para teste
    expect(dummyEntity.updatedAt).not.toEqual(initialUpdatedAt);
    expect(dummyEntity.updatedAt).toEqual(new Date('2023-01-01T10:01:00Z'));
    expect(dummyEntity.createdAt).toEqual(initialUpdatedAt); // createdAt não deve mudar
  });

  it('should have a valid entity_id', () => {
    expect(dummyEntity.entity_id).toBeDefined();
    expect(dummyEntity.entity_id).toBeInstanceOf(Uuid);
    expect(validate(dummyEntity.entity_id.id)).toBe(true);
  });

  it('should return a valid JSON representation', () => {
    const json = dummyEntity.toJSON();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json.id).toBe(dummyEntity.entity_id.id);
    expect(json.name).toBe(dummyEntity.name);
    expect(json.createdAt).toBe(dummyEntity.createdAt.toISOString());
    expect(json.updatedAt).toBe(dummyEntity.updatedAt.toISOString());
  });
});
