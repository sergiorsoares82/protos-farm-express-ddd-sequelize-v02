// __tests__/mocks/entities.mock.ts
import {
  PersonEntity,
  PersonId,
  PersonConstructorProps,
} from '../../../person/person.entity';

export class MockEntityBuilder {
  /**
   * Cria um mock de PersonEntity com dados padrão
   */
  static createMockPerson(
    overrides: Partial<{
      person_id: string;
      name: string;
      person_type: 'física' | 'jurídica';
      created_at: Date;
      updated_at: Date;
    }> = {},
  ): PersonEntity {
    const defaultProps: PersonConstructorProps = {
      name: 'John Doe',
      person_type: 'física',
    };

    const props: PersonConstructorProps = {
      ...defaultProps,
      ...overrides,
      // Converter string para PersonId se fornecido
      person_id: overrides.person_id
        ? PersonId.create(overrides.person_id)
        : undefined,
    };

    return new PersonEntity(props);
  }

  /**
   * Cria uma lista de mock persons
   */
  static createMockPersons(count: number): PersonEntity[] {
    return Array.from({ length: count }, (_, index) => {
      const isJuridica = index % 3 === 0; // A cada 3, uma pessoa jurídica

      return this.createMockPerson({
        name: isJuridica ? `Empresa ${index + 1} LTDA` : `Pessoa ${index + 1}`,
        person_type: isJuridica ? 'jurídica' : 'física',
      });
    });
  }

  /**
   * Cria mock específico para pessoa física
   */
  static createMockPessoaFisica(
    overrides: Partial<{
      person_id: string;
      name: string;
      created_at: Date;
      updated_at: Date;
    }> = {},
  ): PersonEntity {
    return this.createMockPerson({
      ...overrides,
      person_type: 'física',
    });
  }

  /**
   * Cria mock específico para pessoa jurídica
   */
  static createMockPessoaJuridica(
    overrides: Partial<{
      person_id: string;
      name: string;
      created_at: Date;
      updated_at: Date;
    }> = {},
  ): PersonEntity {
    return this.createMockPerson({
      ...overrides,
      person_type: 'jurídica',
    });
  }

  /**
   * Cria mock usando o factory method create()
   */
  static createMockPersonWithFactory(
    overrides: Partial<{
      name: string;
      person_type: 'física' | 'jurídica';
    }> = {},
  ): PersonEntity {
    const defaultProps = {
      name: 'Factory Person',
      person_type: 'física' as const,
    };

    return PersonEntity.create({
      ...defaultProps,
      ...overrides,
    });
  }

  /**
   * Cria mock que deve falhar na validação
   */
  static createInvalidMockPerson(invalidData: {
    name?: string;
    person_type?: any;
  }): PersonEntity {
    // Este método deve ser usado dentro de expect().toThrow()
    return new PersonEntity({
      name: invalidData.name ?? '',
      person_type: invalidData.person_type ?? 'física',
    });
  }

  /**
   * Testa se uma configuração é válida sem lançar erro
   */
  static isValidPersonData(data: {
    name: string;
    person_type: 'física' | 'jurídica';
  }): boolean {
    try {
      new PersonEntity(data);
      return true;
    } catch {
      return false;
    }
  }
}

// Instâncias específicas para os testes
export const mockEntity1 = MockEntityBuilder.createMockPessoaFisica({
  person_id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Alice Johnson',
  created_at: new Date('2024-01-15T08:30:00Z'),
  updated_at: new Date('2024-01-15T08:30:00Z'),
});

export const mockEntity2 = MockEntityBuilder.createMockPessoaJuridica({
  person_id: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Tech Solutions LTDA',
  created_at: new Date('2024-01-20T14:45:00Z'),
  updated_at: new Date('2024-01-20T14:45:00Z'),
});

// Mocks adicionais para diferentes cenários
export const mockPessoaFisica = MockEntityBuilder.createMockPessoaFisica({
  name: 'Maria Silva',
});

export const mockPessoaJuridica = MockEntityBuilder.createMockPessoaJuridica({
  name: 'Inovação Digital LTDA',
});

// Mock para testes de validação (deve falhar na validação)
export const mockEntityInvalid = null; // Não criar automaticamente

// Mock criado com factory method
export const mockPersonFromFactory =
  MockEntityBuilder.createMockPersonWithFactory({
    name: 'Factory Created Person',
    person_type: 'jurídica',
  });
