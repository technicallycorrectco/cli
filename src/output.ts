export function print(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function fail(message: string): never {
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
  throw new Error(message); // unreachable, satisfies TypeScript never
}
