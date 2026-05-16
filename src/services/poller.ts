import { techcorWebApiTasksControllerShow } from "../client/sdk.gen.js";
import type { Task } from "../client/types.gen.js";

const POLL_INTERVAL_MS = 2000;

export async function pollTask(
  orgSlug: string,
  projectSlug: string,
  taskId: number
): Promise<Task> {
  while (true) {
    const { data, error } = await techcorWebApiTasksControllerShow({
      path: { org_slug: orgSlug, project_slug: projectSlug, id: taskId },
    });

    if (error) throw new Error((error as { error: string }).error);

    const task = data as Task;

    if (task.status === "failed") {
      throw new Error(`Task failed: ${task.error ?? "unknown error"}`);
    }

    if (task.status === "awaiting_review" || task.status === "complete") {
      return task;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}
