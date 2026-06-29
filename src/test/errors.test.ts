import { test, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CLI = join(__dirname, "../../dist/index.js");
const DEAD_PORT = 19999;

function makeHome(config: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), "tc-test-"));
  mkdirSync(join(dir, ".technicallycorrect"), { recursive: true });
  writeFileSync(
    join(dir, ".technicallycorrect", "settings.json"),
    JSON.stringify({ cli: config })
  );
  return dir;
}

function runCli(args: string[], home: string) {
  return spawnSync(process.execPath, [CLI, ...args], {
    env: { ...process.env, HOME: home },
    encoding: "utf-8",
  });
}

function assertCleanError(result: ReturnType<typeof runCli>) {
  assert.equal(result.status, 1, `expected exit 1, got ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(result.stderr);
  } catch {
    assert.fail(`stderr is not valid JSON:\n${result.stderr}`);
  }
  assert.ok(
    parsed !== null && typeof parsed === "object" && "error" in (parsed as object),
    `stderr JSON missing "error" key: ${result.stderr}`
  );
  assert.ok(
    !result.stderr.includes("at "),
    `stderr contains a stack trace:\n${result.stderr}`
  );
}

const homes: string[] = [];
after(() => homes.forEach((h) => rmSync(h, { recursive: true, force: true })));

test("tc init with unreachable server exits cleanly with JSON error", () => {
  const home = makeHome({ apiKey: "test-key", host: "localhost", port: DEAD_PORT });
  homes.push(home);
  assertCleanError(runCli(["init"], home));
});

test("tc p list with unreachable server exits cleanly with JSON error", () => {
  // orgSlug must be set so isConfigured() passes and the API call is what fails
  const home = makeHome({ apiKey: "test-key", orgSlug: "test-org", host: "localhost", port: DEAD_PORT });
  homes.push(home);
  assertCleanError(runCli(["p", "list"], home));
});

test("tc r list with unreachable server exits cleanly with JSON error", () => {
  const home = makeHome({ apiKey: "test-key", orgSlug: "test-org", host: "localhost", port: DEAD_PORT });
  homes.push(home);
  assertCleanError(runCli(["r", "list", "--project", "test-project"], home));
});

test("tc t list with unreachable server exits cleanly with JSON error", () => {
  const home = makeHome({ apiKey: "test-key", orgSlug: "test-org", host: "localhost", port: DEAD_PORT });
  homes.push(home);
  assertCleanError(runCli(["t", "list", "--project", "test-project"], home));
});
