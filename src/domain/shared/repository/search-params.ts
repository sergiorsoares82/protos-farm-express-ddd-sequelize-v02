import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_PER_PAGE = 15;
  private static readonly MAX_PER_PAGE = 100;
  private static readonly MAX_PAGE = 1000;
  readonly page: number;
  readonly per_page: number;
  readonly sort: string | null;
  readonly sort_dir: SortDirection | null;
  readonly filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();

    // Normalize page
    const _page = +props.page!;
    this.page =
      Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page
        ? SearchParams.DEFAULT_PAGE
        : Math.min(_page, SearchParams.MAX_PAGE); // Limite máximo de páginas;

    // Normalize per_page
    const _per_page =
      props.per_page === (true as any)
        ? SearchParams.DEFAULT_PER_PAGE
        : +props.per_page!;
    this.per_page =
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
        ? SearchParams.DEFAULT_PER_PAGE
        : Math.min(Math.max(_per_page, 1), SearchParams.MAX_PER_PAGE); // Entre 1 e 100 itens por página;

    // Normalize sort
    const _sort =
      props.sort === null || props.sort === undefined || props.sort === ''
        ? null
        : `${props.sort}`;
    this.sort = _sort;

    // Normalize sort_dir (only if sort exists)
    if (!_sort) {
      this.sort_dir = null;
    } else {
      const dir = `${props.sort_dir}`.toLowerCase();
      this.sort_dir =
        dir !== 'asc' && dir !== 'desc' ? 'asc' : (dir as SortDirection);
    }

    // Normalize filter
    this.filter = this.normalizeFilter(props.filter);
  }

  private normalizeFilter(filter: Filter | null | undefined): Filter | null {
    if (filter === null || filter === undefined) return null;

    // Se for string vazia, retorna null
    if (typeof filter === 'string' && filter.trim() === '') return null;

    return filter;
  }

  // Optional: Factory to clone with changes (like in FP)
  with(
    changes: Partial<SearchParamsConstructorProps<Filter>>,
  ): SearchParams<Filter> {
    return new SearchParams<Filter>({
      page: changes.page ?? this.page,
      per_page: changes.per_page ?? this.per_page,
      sort: changes.sort ?? this.sort,
      sort_dir: changes.sort_dir ?? this.sort_dir,
      filter: changes.filter ?? this.filter,
    });
  }
}
