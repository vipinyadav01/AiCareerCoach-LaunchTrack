"use client";

import { useState, useTransition } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { EmptyState, Panel } from "@/components/app/screen";
import { createGoal, deleteGoal, setGoalDone } from "@/actions/goals";

const EXPIRY_WARNING_DAYS = 60;

// Plain-language status for the date column. Certifications expire; goals are due.
function dateStatus(goal) {
  if (goal.kind !== "certification" && goal.completedAt) {
    return { text: `Done ${format(new Date(goal.completedAt), "d MMM yyyy")}`, tone: "" };
  }
  if (!goal.dueDate) return { text: goal.kind === "certification" ? "No expiry" : "No date", tone: "" };
  const days = differenceInCalendarDays(new Date(goal.dueDate), new Date());
  const date = format(new Date(goal.dueDate), "d MMM yyyy");
  if (goal.kind === "certification") {
    if (days < 0) return { text: `Expired ${date}`, tone: "text-destructive" };
    if (days <= EXPIRY_WARNING_DAYS) return { text: `Expires in ${days} ${days === 1 ? "day" : "days"}`, tone: "text-warning" };
    return { text: `Valid until ${date}`, tone: "" };
  }
  if (days < 0) return { text: `Was due ${date}`, tone: "text-destructive" };
  return { text: `Due ${date}`, tone: "" };
}

function AddForm({ kind }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pending, start] = useTransition();
  const idp = `new-${kind}`;

  const submit = (e) => {
    e.preventDefault();
    start(async () => {
      try {
        await createGoal({ title, kind, dueDate: dueDate || null });
        setTitle("");
        setDueDate("");
      } catch (error) {
        toast.error(error.message || "Could not save");
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_auto] sm:items-end">
      <div className="space-y-1.5">
        <Label htmlFor={`${idp}-title`}>{kind === "certification" ? "Certification" : "Goal"}</Label>
        <Input
          id={`${idp}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder={kind === "certification" ? "AWS Solutions Architect" : "Ship a portfolio project"}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idp}-date`}>{kind === "certification" ? "Expires" : "Target date"}</Label>
        <Input id={`${idp}-date`} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <Button type="submit" disabled={pending || !title.trim()}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
        Add
      </Button>
    </form>
  );
}

function GoalRow({ goal }) {
  const [pending, start] = useTransition();
  const status = dateStatus(goal);
  const done = !!goal.completedAt;

  const toggle = () =>
    start(async () => {
      try {
        await setGoalDone(goal.id, !done);
      } catch (error) {
        toast.error(error.message || "Could not update");
      }
    });

  const remove = () =>
    start(async () => {
      try {
        await deleteGoal(goal.id);
        toast("Removed", {
          description: goal.title,
          action: {
            label: "Undo",
            onClick: async () => {
              const restored = await createGoal({ title: goal.title, kind: goal.kind, dueDate: goal.dueDate });
              if (done) await setGoalDone(restored.id, true);
            },
          },
        });
      } catch (error) {
        toast.error(error.message || "Could not remove");
      }
    });

  return (
    <li className="flex items-center gap-3 px-5 py-3.5" aria-busy={pending}>
      {goal.kind === "goal" && (
        <input
          type="checkbox"
          id={`goal-${goal.id}`}
          checked={done}
          onChange={toggle}
          disabled={pending}
          className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 disabled:cursor-default disabled:opacity-50"
        />
      )}
      <label
        htmlFor={goal.kind === "goal" ? `goal-${goal.id}` : undefined}
        className={`min-w-0 flex-1 ${goal.kind === "goal" ? "cursor-pointer" : ""} ${done ? "text-muted-foreground line-through" : ""}`}
      >
        {goal.title}
      </label>
      <span className={`tabular shrink-0 text-sm ${status.tone || "text-muted-foreground"}`}>{status.text}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={remove}
        disabled={pending}
        className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Remove ${goal.title}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </li>
  );
}

export default function GoalsBoard({ goals }) {
  const list = goals || [];
  const careerGoals = list.filter((g) => g.kind !== "certification");
  const certifications = list.filter((g) => g.kind === "certification");
  const doneCount = careerGoals.filter((g) => g.completedAt).length;

  return (
    <div className="space-y-6">
      <Panel
        title="Career goals"
        description={
          careerGoals.length
            ? `${doneCount} of ${careerGoals.length} done`
            : "Break the next step in your career into things you can tick off."
        }
        bodyClassName="p-0"
      >
        {careerGoals.length > 0 && (
          <>
            <div className="px-5 pt-4">
              <Progress value={(doneCount / careerGoals.length) * 100} className="h-1.5 bg-muted" aria-label="Goals completed" />
            </div>
            <ul className="mt-2 divide-y border-b">
              {careerGoals.map((g) => (
                <GoalRow key={g.id} goal={g} />
              ))}
            </ul>
          </>
        )}
        <div className="p-5">
          <AddForm kind="goal" />
        </div>
      </Panel>

      <Panel
        title="Certifications"
        description={`Anything expiring within ${EXPIRY_WARNING_DAYS} days is flagged so you can renew in time.`}
        bodyClassName="p-0"
      >
        {certifications.length > 0 ? (
          <ul className="divide-y border-b">
            {certifications.map((g) => (
              <GoalRow key={g.id} goal={g} />
            ))}
          </ul>
        ) : (
          <EmptyState
            className="m-5 mb-0 py-6"
            title="No certifications yet"
            description="Add the ones you hold with their expiry date."
          />
        )}
        <div className="p-5">
          <AddForm kind="certification" />
        </div>
      </Panel>
    </div>
  );
}
