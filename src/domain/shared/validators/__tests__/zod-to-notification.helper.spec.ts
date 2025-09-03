import { z, ZodError } from 'zod';
import { addZodErrorsToNotification } from '../zod-to-notification.helper';
import { NotificationError } from '../notification'; // Certifique-se de que o caminho está correto

describe('addZodErrorsToNotification', () => {
  let notificationError: NotificationError;

  beforeEach(() => {
    notificationError = new NotificationError();
  });

  it('should add all Zod validation issues with nested paths to notificationError', () => {
    const userSchema = z.object({
      name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
      email: z.email('Email inválido'),
      // Zod short-circuits: se .int() falhar, .min() não é verificado.
      // Para múltiplos erros, você precisaria de superRefine ou outra estratégia.
      age: z
        .number()
        .int('Idade deve ser um número inteiro')
        .min(18, 'Você deve ter pelo menos 18 anos'),
      address: z
        .object({
          street: z
            .string()
            .min(5, 'Rua é obrigatória')
            .max(100, 'Rua muito longa'),
          city: z.string().min(3, 'Cidade é obrigatória'),
          zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'CEP inválido'),
        })
        .partial(),
      hobbies: z
        .array(z.string().min(1, 'Hobbies não podem ser vazios'))
        .min(1, 'Deve ter pelo menos um hobby'),
      isActive: z.boolean(),
    });

    const invalidUserData = {
      name: '',
      email: 'invalid-email',
      age: 17.5, // Falha int. A validação min não é alcançada.
      address: {
        street: 'abc', // Falha min
        zip: '123', // Falha regex
      },
      hobbies: [], // Falha min
      isActive: 'true', // Falha boolean
    };

    const result = userSchema.safeParse(invalidUserData);
    let zodError: ZodError;

    if (!result.success) {
      zodError = result.error;
    } else {
      throw new Error('Expected parse to fail, but it succeeded.');
    }

    addZodErrorsToNotification(zodError, notificationError);

    expect(notificationError.hasErrors()).toBe(true);

    const expectedErrorsObject = {
      name: ['Nome é obrigatório'],
      email: ['Email inválido'],
      age: [
        'Idade deve ser um número inteiro', // *** APENAS ESTA MENSAGEM ESPERADA PARA 'age' ***
      ],
      address: {
        street: ['Rua é obrigatória'],
        zip: ['CEP inválido'],
      },
      hobbies: ['Deve ter pelo menos um hobby'],
      isActive: ['Invalid input: expected boolean, received string'], // Mensagem atualizada
    };

    expect(notificationError.errorsAsObject()).toEqual(expectedErrorsObject);

    expect(notificationError.getErrors()).toHaveLength(
      Object.keys(expectedErrorsObject).reduce((acc, key) => {
        const value =
          expectedErrorsObject[key as keyof typeof expectedErrorsObject];
        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return acc + (Object.values(value) as string[][]).flat().length;
        }
        return acc + value.length;
      }, 0),
    );
  });

  it('should ignore issues with empty or whitespace-only messages', () => {
    // Gerando ZodError manualmente para garantir os issues esperados
    const zodError = new ZodError([
      {
        code: 'custom',
        message: 'Error message 1',
        path: ['field1'],
      },
      {
        code: 'custom',
        message: '', // Mensagem vazia
        path: ['field2'],
      },
      {
        code: 'custom',
        message: '   ', // Mensagem com apenas espaços
        path: ['field3'],
      },
      {
        code: 'custom',
        message: 'Error message 4',
        path: ['field4'],
      },
    ]);

    addZodErrorsToNotification(zodError, notificationError);

    // Apenas field1 e field4 devem estar presentes
    expect(notificationError.errorsAsObject()).toEqual({
      field1: ['Error message 1'],
      field4: ['Error message 4'],
    });
    expect(notificationError.getErrors()).toHaveLength(2);
  });

  it('should default path to "root" if issue.path is empty', () => {
    const schema = z.string().superRefine((val, ctx) => {
      ctx.addIssue({
        code: 'custom',
        message: 'Erro geral no esquema!',
        path: [],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'Outro erro global',
        path: undefined,
      });
    });

    const result = schema.safeParse('any string');
    let zodError: ZodError;
    if (!result.success) {
      zodError = result.error;
    } else {
      throw new Error('Expected parse to fail.');
    }

    addZodErrorsToNotification(zodError, notificationError);

    expect(notificationError.errorsAsObject()).toEqual({
      root: ['Erro geral no esquema!', 'Outro erro global'],
    });
    expect(notificationError.getErrors('root')).toEqual([
      'Erro geral no esquema!',
      'Outro erro global',
    ]);
  });

  it('should not add any errors if ZodError has no issues', () => {
    const schema = z.string();
    const result = schema.safeParse('valid string');
    let zodError: ZodError;

    if (result.success) {
      zodError = new ZodError([]);
    } else {
      throw new Error('Expected parse to succeed.');
    }

    addZodErrorsToNotification(zodError, notificationError);

    expect(notificationError.hasErrors()).toBe(false);
    expect(notificationError.errorsAsObject()).toEqual({});
    expect(notificationError.getErrors()).toHaveLength(0);
  });

  it('should allow adding multiple errors to the same field', () => {
    const schema = z.object({
      field: z.string().min(5, 'Muito curto').max(10, 'Muito longo'),
    });

    const result = schema.safeParse({ field: 'abc' });
    let zodError: ZodError;
    if (!result.success) {
      zodError = result.error;
    } else {
      throw new Error('Expected parse to fail.');
    }

    addZodErrorsToNotification(zodError, notificationError);
    notificationError.addError('Outra validação falhou', 'field');

    expect(notificationError.errorsAsObject()).toEqual({
      field: ['Muito curto', 'Outra validação falhou'],
    });
    expect(notificationError.getErrors('field')).toEqual([
      'Muito curto',
      'Outra validação falhou',
    ]);
  });

  it('should handle getErrors for a specific field', () => {
    const schema = z.object({
      item: z.string().min(3, 'Item must be at least 3 chars'),
    });
    const result = schema.safeParse({ item: 'ab' });
    let zodError: ZodError;
    if (!result.success) {
      zodError = result.error;
    } else {
      throw new Error('Expected parse to fail.');
    }

    addZodErrorsToNotification(zodError, notificationError);
    expect(notificationError.getErrors('item')).toEqual([
      'Item must be at least 3 chars',
    ]);
    expect(notificationError.getErrors('nonexistentField')).toEqual([]);
  });

  it('should correctly copy errors from another notification instance', () => {
    const sourceNotification = new NotificationError();
    sourceNotification.addError('Error 1', 'fieldA');
    sourceNotification.addError('Error 2', 'nested.fieldB');
    sourceNotification.addError('Global Error', undefined); // Erro global

    notificationError.copyErrors(sourceNotification);

    expect(notificationError.errorsAsObject()).toEqual({
      fieldA: ['Error 1'],
      nested: {
        fieldB: ['Error 2'],
      },
      'Global Error': ['Global Error'], // Mensagem incluída na expectativa
    });
    expect(notificationError.getErrors()).toContain('Global Error');
    expect(notificationError.hasErrors()).toBe(true);
  });
});
