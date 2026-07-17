import { Fragment, type ReactNode } from "react";

/**
 * Minimal, safe Markdown renderer for the subset our content uses (SPEC §38):
 * `##`/`###` headings, `**bold**`, and `-`/`1.` lists. It BUILDS React elements
 * (never dangerouslySetInnerHTML), so authored content cannot inject markup —
 * and it keeps the no-extra-dependency posture the repo favours.
 */

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    return bold ? (
      <strong key={i}>{bold[1]}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    );
  });
}

export function Markdown({ children }: { children: string }) {
  const lines = children.split("\n");
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{renderInline(it)}</li>);
    out.push(
      list.ordered ? (
        <ol key={key++} className="ml-5 list-decimal space-y-1">
          {items}
        </ol>
      ) : (
        <ul key={key++} className="ml-5 list-disc space-y-1">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      flushList();
      continue;
    }
    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      out.push(
        heading[1].length === 2 ? (
          <h2 key={key++} className="mt-2 text-lg font-semibold tracking-tight">
            {renderInline(heading[2])}
          </h2>
        ) : (
          <h3 key={key++} className="mt-2 font-semibold">
            {renderInline(heading[2])}
          </h3>
        ),
      );
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    const ordered = /^\d+\.\s+(.*)$/.exec(line);
    if (ordered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }
    flushList();
    out.push(<p key={key++}>{renderInline(line)}</p>);
  }
  flushList();

  return <div className="space-y-3 leading-relaxed">{out}</div>;
}
