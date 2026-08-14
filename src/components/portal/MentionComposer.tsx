"use client";

import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MessageSquarePlus, RefreshCw, Send, CheckCircle2, AtSign } from "lucide-react";
import { usePortalAuth } from "@/lib/portal/auth";
import { addClientMessage } from "@/lib/portal/client-messages";
import { getTasksForProject } from "@/lib/portal/project-details";
import type { ClientMessageType, PortalProject } from "@/lib/portal/types";

const TYPE_OPTIONS: { value: ClientMessageType; label: string; icon: typeof MessageSquarePlus }[] = [
  { value: "suggestion", label: "Suggestion", icon: MessageSquarePlus },
  { value: "update_request", label: "Update", icon: RefreshCw },
];

/**
 * Feedback composer with a live @ mention picker: typing "@" opens a
 * dropdown of the client's projects, filtered by whatever's typed after it.
 * Picking one inserts "@Project Name " into the text at the cursor and tags
 * the message to that project; a row of that project's tasks then appears
 * so a specific task can be tagged too. No project tag means the message is
 * general feedback, same as before.
 */
export function MentionComposer({
  projects,
  onSent,
}: {
  projects: PortalProject[];
  onSent?: () => void;
}) {
  const { client } = usePortalAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [type, setType] = useState<ClientMessageType>("suggestion");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState<number | null>(null);

  const [taggedProject, setTaggedProject] = useState<PortalProject | null>(null);
  const [taggedTaskId, setTaggedTaskId] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!mentionOpen) return [];
    const q = mentionQuery.trim().toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [mentionOpen, mentionQuery, projects]);

  const tasks = taggedProject ? getTasksForProject(taggedProject.id) : [];

  const onChangeBody = (value: string, cursor: number) => {
    setBody(value);
    const uptoCursor = value.slice(0, cursor);
    const atIndex = uptoCursor.lastIndexOf("@");
    if (atIndex === -1) {
      setMentionOpen(false);
      return;
    }
    const between = uptoCursor.slice(atIndex + 1);
    // Bail out once there's a line break or another @ in between — that
    // means we've moved past the mention the user was just typing.
    if (/[\n@]/.test(between)) {
      setMentionOpen(false);
      return;
    }
    setMentionStart(atIndex);
    setMentionQuery(between);
    setMentionOpen(true);
  };

  const pickProject = (project: PortalProject) => {
    const el = textareaRef.current;
    const cursor = el?.selectionStart ?? body.length;
    if (mentionStart === null || !el) return;

    const before = body.slice(0, mentionStart);
    const after = body.slice(cursor);
    const inserted = `@${project.name} `;
    const nextValue = before + inserted + after;

    setBody(nextValue);
    setTaggedProject(project);
    setTaggedTaskId(null);
    setMentionOpen(false);

    requestAnimationFrame(() => {
      const pos = before.length + inserted.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const toggleTask = (taskId: string, taskTitle: string) => {
    if (taggedTaskId === taskId) {
      setTaggedTaskId(null);
      return;
    }
    setTaggedTaskId(taskId);
    setBody((prev) => (prev.includes(`#${taskTitle}`) ? prev : `${prev.trimEnd()} #${taskTitle} `));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") setMentionOpen(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!client || !body.trim()) return;

    addClientMessage(client.id, taggedProject?.id ?? null, type, body, taggedTaskId);
    setBody("");
    setTaggedProject(null);
    setTaggedTaskId(null);
    setSent(true);
    onSent?.();
    window.setTimeout(() => setSent(false), 2200);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-1.5">
          {TYPE_OPTIONS.map((option) => {
            const isActive = type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                data-cursor="link"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  isActive ? "bg-brand text-white" : "bg-ink/[0.06] text-ink-muted hover:bg-ink/[0.1]"
                }`}
              >
                <option.icon className="h-3 w-3" strokeWidth={1.75} />
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            required
            rows={3}
            placeholder="Type @ to tag a project…"
            value={body}
            onChange={(e) => onChangeBody(e.target.value, e.target.selectionStart)}
            onKeyDown={onKeyDown}
            onBlur={() => window.setTimeout(() => setMentionOpen(false), 120)}
            className="w-full resize-none rounded-xl border border-ink/10 bg-white/70 px-3.5 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />

          {mentionOpen ? (
            <div className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-white/80 bg-white shadow-float">
              {matches.length === 0 ? (
                <p className="px-3.5 py-2.5 text-xs text-ink-soft">No matching projects.</p>
              ) : (
                matches.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickProject(project)}
                    data-cursor="link"
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs text-ink transition-colors hover:bg-brand-soft"
                  >
                    <AtSign className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>

        {taggedProject && tasks.length > 0 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
              Tag a task in {taggedProject.name}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tasks.map((task) => {
                const isTagged = taggedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id, task.title)}
                    data-cursor="link"
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isTagged ? "bg-brand text-white" : "bg-ink/[0.06] text-ink-muted hover:bg-ink/[0.1]"
                    }`}
                  >
                    {task.title}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!body.trim()}
          data-cursor="link"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {sent ? (
            <>
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
              Sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={1.75} />
              Send
            </>
          )}
        </button>
      </form>
    </div>
  );
}
