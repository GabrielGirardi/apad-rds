import * as React from "react";
import { z } from "zod";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  Table as TanStackTable,
  Column,
  SortingState,
  useReactTable,
  VisibilityState,
  Cell,
} from "@tanstack/react-table";

import CampaignForm from "./form";
import { deleteCampaign } from "@/lib/api/campaign";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useSession } from "@/hooks/use-session";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DragHandle from "@/components/DragHandle";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent
} from "@/components/ui/tabs";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns
} from "@tabler/icons-react";

export const schema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  targetAmount: z.string().optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  finishAt: z.string().optional().nullable(),
});

type CampaignRow = z.infer<typeof schema>;

type ActionProps = {
  row: Row<CampaignRow>;
  onRefresh: () => void;
};

function CampaignActions({ row, onRefresh }: ActionProps) {
  const confirmDialog = useConfirmDialog();
  const { isViewer, loading } = useSession();

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      toast.success("Campanha removida");
      onRefresh?.();
    },
    onError: () => {
      toast.error("Falha ao remover a campanha");
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: "Confirmar exclusão?",
      description: "Esta ação excluirá a campanha permanentemente.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });
    if (confirmed) mutateDelete(row.original.id);
  };

  if (loading) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" hidden={isViewer} size="icon">
          <IconDotsVertical />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={(e: React.MouseEvent) => e.stopPropagation()} asChild>
          <CampaignForm
            type="edit"
            initialData={{
              id: row.original.id,
              title: row.original.title,
              description: row.original.description ?? undefined,
              targetAmount: row.original.targetAmount ? Number(row.original.targetAmount) : undefined,
              finishAt: row.original.finishAt ?? '',
              isActive: row.original.isActive,
            }}
            onRefresh={onRefresh}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<CampaignRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }: { row: Row<CampaignRow> }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "title",
    header: "Título",
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<CampaignRow> }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<CampaignRow> }) => <p>{row.original.description ?? "-"}</p>,
  },
  {
    accessorKey: "targetAmount",
    header: "Meta",
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<CampaignRow> }) => <div>{row.original.targetAmount ?? "-"}</div>,
  },
  {
    accessorKey: "finishAt",
    header: "Finaliza em",
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<CampaignRow> }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.finishAt ? new Date(row.original.finishAt).toLocaleDateString("pt-BR") : "-"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado",
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<CampaignRow> }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {new Date(row.original.createdAt).toLocaleDateString("pt-BR")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Ativo",
    enableColumnFilter: true,
    filterFn: (row: Row<CampaignRow>, columnId: string, filterValue: string | undefined) => {
      if (!filterValue || filterValue === "all") return true;
      return String(row.getValue(columnId)) === filterValue;
    },
    cell: ({ row }: { row: Row<CampaignRow> }) => <Badge variant="outline" className="text-muted-foreground px-1.5">{row.original.isActive ? "Sim" : "Não"}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row, table }: { row: Row<CampaignRow>; table: TanStackTable<CampaignRow> }) => (
      <CampaignActions
        row={row}
        // @ts-expect-error | use columnDef to get name
        onRefresh={table.options.meta?.onRefresh || []}
      />
    ),
  },
];

function DraggableRow({ row }: { row: Row<CampaignRow> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell: Cell<CampaignRow, unknown>) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
  onRefresh,
}: {
  data: CampaignRow[];
  onRefresh: () => void;
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
  const sortableId = React.useId();

  const { isViewer, loading } = useSession();

  React.useEffect(() => setData(initialData), [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    meta: { onRefresh },
    getRowId: (row: CampaignRow) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((current) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }

  if (loading) return null;

  return (
    <Tabs defaultValue="list" className="w-full flex-col justify-start gap-6 mb-24">
      <div className="flex items-center">
        <div className="flex flex-wrap gap-2 items-center justify-between w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar por título..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => table.getColumn("title")?.setFilterValue(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              value={(table.getColumn("isActive")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value: string) => table.getColumn("isActive")?.setFilterValue(value === "all" ? undefined : value)}
            >
              <SelectTrigger className="h-8 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos (Ativo)</SelectItem>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Exibir</span>
                  <span className="lg:hidden">Colunas</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                  .map((column: Column<CampaignRow, unknown>) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                      >
                        {/* @ts-expect-error | use columnDef to get name */}
                        {column.columnDef.header || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            {!isViewer && (<CampaignForm type="create" onRefresh={onRefresh} />)}
          </div>
        </div>
      </div>

      <TabsContent value="list" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row: Row<CampaignRow>) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Nenhum dado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">Linhas por página</Label>
              <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value: string) => table.setPageSize(Number(value))}>
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-fit items-center justify-center text-sm font-medium">Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Ir para o início</span>
                <IconChevronsLeft />
              </Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Próxima página</span>
                <IconChevronRight />
              </Button>
              <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Ir para o final</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TableCellViewer({ item }: { item: CampaignRow }) {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left cursor-pointer">{item.title}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detalhes da campanha</DrawerTitle>
          <DrawerDescription>Visualizando {item.title}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label>Título</Label>
              <Input disabled defaultValue={item.title} />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Descrição</Label>
              <Input disabled defaultValue={item.description ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label>Meta</Label>
                <Input disabled defaultValue={item.targetAmount ?? ""} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Finaliza em</Label>
                <Input disabled defaultValue={item.finishAt ? item.finishAt.split("T")[0] : ""} type="date" />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
