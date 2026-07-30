import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type FieldType = "text" | "number" | "date" | "select" | "textarea" | "switch" | "email";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: string | number | boolean;
  span?: 1 | 2;
};

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Row = Record<string, unknown>;

export function RecordManager<T extends Row>({
  table,
  singular,
  fields,
  columns,
  searchKeys,
  orderBy = "created_at",
  emptyHint,
}: {
  table: "schools" | "teachers" | "students";
  singular: string;
  fields: Field[];
  columns: Column<T>[];
  searchKeys: string[];
  orderBy?: string;
  emptyHint?: string;
}) {
  const queryClient = useQueryClient();
  const { canWrite } = useRoles();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<T | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});

  const { data = [], isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, searchKeys]);

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase
          .from(table)
          .update(payload as never)
          .eq("id", editing.id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success(editing ? `${singular} record updated` : `${singular} record created`);
      setFormOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (row: T) => {
      const { error } = await supabase.from(table).delete().eq("id", row.id as string);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success(`${singular} record removed`);
      setDeleteTarget(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? (f.type === "switch" ? false : "");
    });
    setValues(initial);
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(row: T) {
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      initial[f.name] = row[f.name] ?? (f.type === "switch" ? false : "");
    });
    setValues(initial);
    setEditing(row);
    setFormOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (f.required && (raw === "" || raw === undefined || raw === null)) {
        toast.error(`${f.label} is required`);
        return;
      }
      if (f.type === "number") payload[f.name] = raw === "" ? 0 : Number(raw);
      else if (f.type === "switch") payload[f.name] = Boolean(raw);
      else payload[f.name] = raw === "" ? null : raw;
    }
    save.mutate(payload);
  }

  function exportCsv() {
    const header = columns.map((c) => c.header).join(",");
    const lines = filtered.map((row) =>
      columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table}-register.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${singular.toLowerCase()} register…`}
            className="pl-9"
          />
        </div>
        <Badge variant="outline">{filtered.length} records</Badge>
        <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}>
          <Download className="size-4" /> Export CSV
        </Button>
        {canWrite && (
          <Button onClick={openCreate}>
            <Plus className="size-4" /> New {singular.toLowerCase()}
          </Button>
        )}
      </div>

      <div className="gov-panel overflow-x-auto rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key}>{c.header}</TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  Loading register…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  {emptyHint ?? `No ${singular.toLowerCase()} records yet.`}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={String(row.id)}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  {canWrite ? (
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(row)}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Read only</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? `Amend ${singular.toLowerCase()} record` : `Register new ${singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              All fields marked required must be completed before the record is committed to the
              national register.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : undefined}>
                <Label htmlFor={f.name} className="mb-1.5 block text-xs uppercase tracking-wide">
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </Label>
                {f.type === "select" ? (
                  <Select
                    value={(values[f.name] as string) ?? ""}
                    onValueChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    value={(values[f.name] as string) ?? ""}
                    onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    maxLength={1000}
                  />
                ) : f.type === "switch" ? (
                  <div className="flex h-9 items-center gap-2">
                    <Switch
                      id={f.name}
                      checked={Boolean(values[f.name])}
                      onCheckedChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
                    />
                    <span className="text-sm text-muted-foreground">{f.help}</span>
                  </div>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : "text"}
                    value={(values[f.name] as string) ?? ""}
                    onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    maxLength={f.type === "number" ? undefined : 200}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving…" : editing ? "Save amendments" : "Commit record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this {singular.toLowerCase()} record?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record from the national register. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>
              Remove record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
