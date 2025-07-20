// utils/errorUtils.ts
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function formatZodError(error: unknown) {
  if (error instanceof Error && 'errors' in error) {
    return (error as any).errors; // can refine if using Zod directly
  }
  return undefined;
}
