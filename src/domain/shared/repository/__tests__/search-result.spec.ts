// __tests__/search-result.test.ts
import { PersonEntity } from '../../../person/person.entity';
import { SearchResult } from '../search-result';
import {
  mockEntity1,
  mockEntity2,
  MockEntityBuilder,
  mockPessoaFisica,
  mockPessoaJuridica,
} from './mock-entities';

describe('SearchResult with PersonEntity', () => {
  describe('Constructor', () => {
    it('should create valid search result with person entities', () => {
      const items = [mockEntity1, mockEntity2];
      const result = new SearchResult({
        items,
        total: 100,
        current_page: 2,
        per_page: 10,
      });

      expect(result.items).toEqual(items);
      expect(result.items[0].name).toBe('Alice Johnson');
      expect(result.items[0].person_type).toBe('física');
      expect(result.items[1].name).toBe('Tech Solutions LTDA');
      expect(result.items[1].person_type).toBe('jurídica');
      expect(result.total).toBe(100);
      expect(result.current_page).toBe(2);
      expect(result.per_page).toBe(10);
      expect(result.last_page).toBe(10);
    });

    it('should work with mixed person types', () => {
      const items = [mockPessoaFisica, mockPessoaJuridica];
      const result = new SearchResult({
        items,
        total: 2,
        current_page: 1,
        per_page: 10,
      });

      expect(result.items[0].person_type).toBe('física');
      expect(result.items[1].person_type).toBe('jurídica');
      expect(result.items.length).toBe(2);
    });

    it('should handle large datasets of persons', () => {
      const items = MockEntityBuilder.createMockPersons(50);
      const result = new SearchResult({
        items: items.slice(0, 10),
        total: items.length,
        per_page: 10,
        current_page: 1,
      });

      expect(result.items.length).toBe(10);
      expect(result.total).toBe(50);
      expect(result.last_page).toBe(5);

      // Verificar se há mix de pessoas físicas e jurídicas
      const fisicas = result.items.filter((p) => p.person_type === 'física');
      const juridicas = result.items.filter(
        (p) => p.person_type === 'jurídica',
      );
      expect(fisicas.length + juridicas.length).toBe(10);
    });

    it('should work with factory-created persons', () => {
      const factoryPerson = MockEntityBuilder.createMockPersonWithFactory({
        name: 'Factory Test',
        person_type: 'física',
      });

      const result = new SearchResult({
        items: [factoryPerson],
        total: 1,
        current_page: 1,
        per_page: 10,
      });

      expect(result.items[0].name).toBe('Factory Test');
      expect(result.items[0].person_type).toBe('física');
    });
  });
  describe('Navigation with PersonEntity', () => {
    it('should correctly handle pagination with persons', () => {
      const persons = MockEntityBuilder.createMockPersons(25);
      const result = new SearchResult({
        items: persons.slice(10, 20), // Página 2
        total: 25,
        current_page: 2,
        per_page: 10,
      });

      expect(result.hasNextPage).toBeTruthy();
      expect(result.hasPreviousPage).toBeTruthy();
      expect(result.nextPage).toBe(3);
      expect(result.previousPage).toBe(1);
      expect(result.last_page).toBe(3);
    });

    it('should handle items range correctly', () => {
      const persons = MockEntityBuilder.createMockPersons(10);
      const result = new SearchResult({
        items: persons,
        total: 25,
        current_page: 1,
        per_page: 10,
      });

      const range = result.itemsRange;
      expect(range.from).toBe(1);
      expect(range.to).toBe(10);
    });
  });
  describe('toJSON with PersonEntity', () => {
    it('should serialize person entities without forcing JSON', () => {
      const items = [mockEntity1, mockEntity2];
      const result = new SearchResult({
        items,
        total: 2,
        current_page: 1,
        per_page: 10,
      });

      const json = result.toJSON();

      expect(json.items).toEqual(items); // Entidades originais
      expect(json.total).toBe(2);
    });

    it('should serialize person entities forcing JSON', () => {
      const items = [mockEntity1, mockEntity2];
      const result = new SearchResult({
        items,
        total: 2,
        current_page: 1,
        per_page: 10,
      });

      const json = result.toJSON(true);

      expect(json.items[0]).toEqual({
        person_id: expect.any(String),
        name: 'Alice Johnson',
        person_type: 'física',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });

      expect(json.items[1]).toEqual({
        person_id: expect.any(String),
        name: 'Tech Solutions LTDA',
        person_type: 'jurídica',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });
  describe('Factory methods with PersonEntity', () => {
    it('should create empty result for persons', () => {
      const result = SearchResult.empty<PersonEntity>();

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(1000);
    });

    it('should create single page result with persons', () => {
      const items = [mockEntity1, mockEntity2];
      const result = SearchResult.singlePage(items);

      expect(result.items).toEqual(items);
      expect(result.total).toBe(2);
      expect(result.last_page).toBe(1);
      expect(result.per_page).toBe(2);
    });
  });

  describe('Validation scenarios', () => {
    describe('Invalid person data', () => {
      it('should throw error for empty name', () => {
        expect(() => {
          MockEntityBuilder.createInvalidMockPerson({
            name: '',
          });
        }).toThrow();
      });

      it('should throw error for name too short', () => {
        expect(() => {
          MockEntityBuilder.createInvalidMockPerson({
            name: 'A', // Apenas 1 caractere
          });
        }).toThrow();
      });

      it('should throw error for name too long', () => {
        expect(() => {
          MockEntityBuilder.createInvalidMockPerson({
            name: 'A'.repeat(101), // Mais de 100 caracteres
          });
        }).toThrow();
      });

      it('should throw error for invalid person_type', () => {
        expect(() => {
          MockEntityBuilder.createInvalidMockPerson({
            name: 'Valid Name',
            person_type: 'invalid' as any,
          });
        }).toThrow();
      });
    });

    describe('Valid person data', () => {
      it('should accept minimum valid name length', () => {
        expect(() => {
          MockEntityBuilder.createMockPerson({
            name: 'AB', // 2 caracteres - mínimo válido
            person_type: 'física',
          });
        }).not.toThrow();
      });

      it('should accept maximum valid name length', () => {
        expect(() => {
          MockEntityBuilder.createMockPerson({
            name: 'A'.repeat(100), // 100 caracteres - máximo válido
            person_type: 'jurídica',
          });
        }).not.toThrow();
      });

      it('should work with valid person types', () => {
        expect(() => {
          MockEntityBuilder.createMockPerson({
            name: 'Valid Name',
            person_type: 'física',
          });
        }).not.toThrow();

        expect(() => {
          MockEntityBuilder.createMockPerson({
            name: 'Valid Name',
            person_type: 'jurídica',
          });
        }).not.toThrow();
      });
    });

    describe('SearchResult with invalid persons handling', () => {
      it('should not create SearchResult with invalid persons', () => {
        // Tentar criar pessoas inválidas deve falhar antes de chegar ao SearchResult
        expect(() => {
          const invalidPerson = MockEntityBuilder.createInvalidMockPerson({
            name: '',
          });

          new SearchResult({
            items: [invalidPerson],
            total: 1,
            current_page: 1,
            per_page: 10,
          });
        }).toThrow();
      });

      it('should work with all valid persons', () => {
        const validPersons = [
          MockEntityBuilder.createMockPerson({
            name: 'Valid Person 1',
            person_type: 'física',
          }),
          MockEntityBuilder.createMockPerson({
            name: 'Valid Person 2',
            person_type: 'jurídica',
          }),
        ];

        expect(() => {
          new SearchResult({
            items: validPersons,
            total: 2,
            current_page: 1,
            per_page: 10,
          });
        }).not.toThrow();
      });
    });
  });
});
