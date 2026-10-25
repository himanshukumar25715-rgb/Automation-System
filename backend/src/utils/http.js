import { randomUUID } from 'node:crypto';

// Structured error response used by the newer endpoints:
// { success:false, code, message, fieldErrors?, requestId }
export function apiError(res, status, code, message, fieldErrors) {
  const body = { success: false, code, message, requestId: randomUUID() };
  if (fieldErrors && Object.keys(fieldErrors).length) body.fieldErrors = fieldErrors;
  return res.status(status).json(body);
}
