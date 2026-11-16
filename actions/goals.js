"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { requireDbUser } from "@/lib/checkUser";

const KINDS = ["goal", "certification"];

const getDbUser = requireDbUser;

// Inputs come from the browser: trim, bound and type-check everything.
function parseGoal(input) {
  const title = String(input?.title ?? "").trim();
  if (!title) throw new Error("Give the goal a name");
  if (title.length > 200) throw new Error("Keep the name under 200 characters");

  const kind = KINDS.includes(input?.kind) ? input.kind : "goal";

  let dueDate = null;
  if (input?.dueDate) {
    dueDate = new Date(input.dueDate);
    if (Number.isNaN(dueDate.getTime())) throw new Error("That date is not valid");
  }
  return { title, kind, dueDate };
}

function refresh() {
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function getGoals() {
  const user = await getDbUser();
  return db.goal.findMany({
    where: { userId: user.id },
    orderBy: [{ completedAt: { sort: "asc", nulls: "first" } }, { dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });
}

export async function createGoal(input) {
  const user = await getDbUser();
  const goal = await db.goal.create({ data: { ...parseGoal(input), userId: user.id } });
  refresh();
  return goal;
}

export async function setGoalDone(id, done) {
  const user = await getDbUser();
  const goal = await db.goal.update({
    where: { id: String(id), userId: user.id },
    data: { completedAt: done ? new Date() : null },
  });
  refresh();
  return goal;
}

export async function deleteGoal(id) {
  const user = await getDbUser();
  await db.goal.delete({ where: { id: String(id), userId: user.id } });
  refresh();
  return { success: true };
}
