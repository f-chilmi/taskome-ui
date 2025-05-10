/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { type UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { projectSchema } from "@/types/schemas";

function DraggableRow({ row }: { row: Row<z.infer<typeof projectSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ProjectDataTable({
  data: initialData,
  getDetail,
  create,
  update,
  deleteProject,
}: {
  data: z.infer<typeof projectSchema>[];
  getDetail: (id: string) => Promise<any>;
  create: (formData: FormData) => Promise<any>;
  update: (formData: FormData) => void;
  deleteProject: (id: string) => void;
}) {
  const [data, setData] = React.useState(() => initialData);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ _id }) => _id) || [],
    [data]
  );

  const getProjectDetail = async (id: string): Promise<number> => {
    const data = await getDetail(id);
    return data?.tasks?.length || 0;
  };

  const onCreate = async (formData: FormData) => {
    const res = await create(formData);

    setData((prev) => [...prev, res.data]);
  };
  const onUpdate = (formData: FormData) => {
    update(formData);
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, name, description } : item
      )
    );
  };
  const onDelete = (id: string) => {
    deleteProject(id);

    setData((prev) => prev.filter((item) => item._id !== id));
  };

  const columns: ColumnDef<z.infer<typeof projectSchema>>[] = [
    {
      accessorKey: "name",
      header: "Project name",
      cell: ({ row }) => {
        return (
          <TableCellViewer
            isNew={false}
            item={row.original}
            create={onCreate}
            update={onUpdate}
            onDelete={onDelete}
            getDetail={async () => await getProjectDetail(row.id)}
          />
        );
      },
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id.toString(),
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

  return (
    <div defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <TableCellViewer
          isNew
          item={{ name: "", description: "", _id: "" }}
          create={onCreate}
          update={function (): void {}}
          onDelete={function (): void {}}
        />
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* </DndContext> */}
        </div>
        <div className="flex items-center justify-end px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex ml-auto">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableCellViewer({
  isNew = false,
  item,
  create,
  update,
  onDelete,
  getDetail,
}: {
  isNew: boolean;
  item: z.infer<typeof projectSchema>;
  create: (formData: FormData) => void;
  update: (formData: FormData) => void;
  onDelete: (id: string) => void;
  getDetail?: () => Promise<number>;
}) {
  const isMobile = useIsMobile();

  const [taskCount, setTaskCount] = React.useState(0);

  const getDetailProject = async () => {
    const taskAssociated = await getDetail?.();
    setTaskCount(taskAssociated || 0);
  };

  async function handleSubmitUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("id", item._id);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (name === item.name && description === item.description) {
      toast("No changes detected");
      return;
    }

    try {
      if (isNew) {
        await create(formData);
      } else {
        await update(formData);
      }

      toast.success(
        isNew ? "Create project success!" : "Update project success!"
      );
    } catch (err) {
      toast.error(
        (err as any).message ||
          (isNew ? "Create project failed!" : "Update project failed!")
      );
    }
  }
  async function handleDelete(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (taskCount > 0) return;

    try {
      await onDelete(item._id);
      toast.success("Delete project success!");
    } catch (err) {
      toast.error((err as any).message || "Delete project failed");
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant={isNew ? "outline" : "link"}
          onClick={isNew ? () => {} : getDetailProject}
          className={cn("w-fit ", !isNew && "px-0 text-foreground text-left")}
        >
          {isNew ? "Create a new project" : item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmitUpdate} className="flex flex-col h-full">
          <DrawerHeader className="gap-1">
            <DrawerTitle>{item.name}</DrawerTitle>
            <DrawerDescription>Project detail</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  defaultValue={item.name}
                  placeholder="Input project name"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  name="description"
                  id="description"
                  defaultValue={item.description}
                  placeholder="Input project description"
                />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="submit">Done</Button>
            </DrawerClose>
            {!isNew && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={taskCount > 0}
              >
                Delete ({taskCount} task(s) associated to this project)
              </Button>
            )}
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
