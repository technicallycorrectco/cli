export function print(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printList(data: unknown): void {
  const result =
    data != null &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
      ? data
      : { data: [] };
  console.log(JSON.stringify(result, null, 2));
}

const isInteractive = !!process.stderr.isTTY;

export function fail(message: string): never {
  console.error(isInteractive ? message : JSON.stringify({ error: message }, null, 2));
  process.exit(1);
  throw new Error(message); // unreachable, satisfies TypeScript never
}

export function failApiError(error: unknown): never {
  if (error instanceof Error)
    return fail(`Could not reach the API server — is it running? (${error.message})`);
  return fail((error as { error?: string } | undefined)?.error ?? "Unknown API error");
}
