import { SearchParams } from '../search-params';

describe('SearchParams', () => {
  describe('Constructor', () => {
    it('should use default values when no props provided', () => {
      const params = new SearchParams();

      expect(params.page).toBe(1);
      expect(params.per_page).toBe(15);
      expect(params.sort).toBeNull();
      expect(params.sort_dir).toBeNull();
      expect(params.filter).toBeNull();
    });
    it('should normalize invalid page values', () => {
      const testCases = [
        { input: 0, expected: 1 },
        { input: -5, expected: 1 },
        { input: 1.5, expected: 1 },
        { input: NaN, expected: 1 },
        { input: 'invalid', expected: 1 },
      ];

      testCases.forEach(({ input, expected }) => {
        const params = new SearchParams({ page: input as any });
        expect(params.page).toBe(expected);
      });
    });
    it('should set sort_dir to null when sort is null', () => {
      const params = new SearchParams({
        sort: null,
        sort_dir: 'desc',
      });

      expect(params.sort_dir).toBeNull();
    });
    it('should normalize sort_dir to asc when invalid', () => {
      const params = new SearchParams({
        sort: 'name',
        sort_dir: 'invalid' as any,
      });

      expect(params.sort_dir).toBe('asc');
    });
  });
  describe('with() method', () => {
    it('should create new instance with changes', () => {
      const original = new SearchParams({ page: 1, per_page: 10 });
      const modified = original.with({ page: 2 });

      expect(original.page).toBe(1); // Imutabilidade
      expect(modified.page).toBe(2);
      expect(modified.per_page).toBe(10); // Mantém outros valores
    });
  });
  describe('Value Object behavior', () => {
    it('should be equal when all properties match', () => {
      const params1 = new SearchParams({ page: 1, per_page: 15 });
      const params2 = new SearchParams({ page: 1, per_page: 15 });

      expect(params1.equals(params2)).toBeTruthy();
    });
  });
});
