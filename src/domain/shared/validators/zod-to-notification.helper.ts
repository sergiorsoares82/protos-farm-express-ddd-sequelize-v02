import type { ZodError } from 'zod';
import type { NotificationError } from './notification';

export function addZodErrorsToNotification(
  zodError: ZodError,
  notificationError: NotificationError,
) {
  for (const issue of zodError.issues) {
    if (!issue.message || issue.message.trim() === '') continue; // skip empty messages

    const path =
      Array.isArray(issue.path) && issue.path.length > 0
        ? issue.path.join('.')
        : 'root';

    notificationError.addError(issue.message, path);
  }
}
