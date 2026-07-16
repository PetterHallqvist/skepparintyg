import { cn } from "@/lib/utils";

export function AdminTable({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-card",
        className,
      )}
    >
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="text-label px-4 py-3 text-left text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="px-4 py-10 text-center text-sm text-muted-foreground"
      >
        {message}
      </td>
    </tr>
  );
}
