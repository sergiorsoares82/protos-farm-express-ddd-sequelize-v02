import type { NotificationError } from './notification';

export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;

export interface IValidatorFields {
  validate(
    notificationError: NotificationError,
    data: any,
    fields: string[],
  ): boolean;
}
