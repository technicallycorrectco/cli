import { test } from "node:test";
import assert from "node:assert/strict";
import { fail } from "../output.js";

test("fail() writes JSON error to stderr", (t) => {
  const captured: string[] = [];
  t.mock.method(console, "error", (msg: string) => captured.push(msg));
  t.mock.method(process, "exit", (_code: number) => {});

  try {
    fail("something went wrong");
  } catch {
    // process.exit is mocked so the unreachable throw runs — expected
  }

  assert.equal(captured.length, 1);
  assert.deepEqual(JSON.parse(captured[0]), { error: "something went wrong" });
});

test("fail() exits with code 1", (t) => {
  let exitCode: number | undefined;
  t.mock.method(console, "error", () => {});
  t.mock.method(process, "exit", (code: number) => {
    exitCode = code;
  });

  try {
    fail("oops");
  } catch {
    // expected
  }

  assert.equal(exitCode, 1);
});
