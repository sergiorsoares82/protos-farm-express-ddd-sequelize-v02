import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import type { Uuid } from '../value-objects/uuid.vo';

type EntityT = Entity<Uuid>;

type SearchResultConstructorProps<E extends EntityT> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
};

export class SearchResult<E extends EntityT = EntityT> extends ValueObject {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;

  private static readonly MIN_PER_PAGE = 1;
  private static readonly MAX_PER_PAGE = 1000;

  constructor(props: SearchResultConstructorProps<E>) {
    super();

    const total = Math.max(0, props.total); // total cannot be negative
    const per_page = Math.max(
      SearchResult.MIN_PER_PAGE,
      Math.min(SearchResult.MAX_PER_PAGE, Math.floor(props.per_page)),
    ); // at least 1 item per page
    const last_page = total === 0 ? 1 : Math.ceil(total / per_page); // at least 1 page

    let current_page = Math.max(1, Math.floor(props.current_page));
    if (current_page > last_page) current_page = last_page;

    // Validar consistência entre items e paginação
    this.validateItemsConsistency(props.items, current_page, per_page, total);

    this.items = props.items;
    this.total = total;
    this.per_page = per_page;
    this.last_page = last_page;
    this.current_page = current_page;
  }

  private validateItemsConsistency(
    items: E[],
    currentPage: number,
    perPage: number,
    total: number,
  ): void {
    // Validar se o número de items está coerente com a paginação
    const expectedMaxItems =
      currentPage === this.last_page ? total % perPage || perPage : perPage;

    if (items.length > expectedMaxItems) {
      throw new Error(
        `Items array length (${items.length}) exceeds expected maximum (${expectedMaxItems}) for page ${currentPage}`,
      );
    }
  }

  get hasNextPage(): boolean {
    return this.current_page < this.last_page;
  }

  get nextPage(): number | null {
    return this.hasNextPage ? this.current_page + 1 : null;
  }

  get hasPreviousPage(): boolean {
    return this.current_page > 1;
  }

  get previousPage(): number | null {
    return this.hasPreviousPage ? this.current_page - 1 : null;
  }

  get itemsRange(): { from: number; to: number } {
    if (this.total === 0) return { from: 0, to: 0 };

    const from = (this.current_page - 1) * this.per_page + 1;
    const to = Math.min(from + this.items.length - 1, this.total);

    return { from, to };
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
    };
  }

  // Optional: quick factory for empty results
  static empty<E extends EntityT>(
    per_page = SearchResult.MAX_PER_PAGE,
  ): SearchResult<E> {
    return new SearchResult<E>({
      items: [],
      total: 0,
      current_page: 1,
      per_page,
    });
  }

  static singlePage<E extends EntityT>(items: E[]): SearchResult<E> {
    return new SearchResult<E>({
      items,
      total: items.length,
      current_page: 1,
      per_page: items.length || 1,
    });
  }
}
