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
import { Button } from "@/components/ui/button";
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
import { Badge } from "../ui/badge";
import { PriorityEnum, StatusEnum } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { projectSchema, taskSchema, userSchema } from "@/types/schemas";
import TableCellViewer from "./table-cell";

function DraggableRow({ row }: { row: Row<z.infer<typeof taskSchema>> }) {
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

export const statusColorMap: Record<StatusEnum, string> = {
  [StatusEnum.NOT_STARTED]: "text-gray-600 border-gray-600",
  [StatusEnum.IN_PROGRESS]: "text-blue-600 border-blue-600",
  [StatusEnum.DONE]: "text-green-600 border-green-600",
};
export const priorityColorMap: Record<PriorityEnum, string> = {
  [PriorityEnum.LOW]: "text-gray-600 border-gray-600",
  [PriorityEnum.MEDIUM]: "text-yellow-600 border-yellow-600",
  [PriorityEnum.HIGH]: "text-red-600 border-red-600",
};

export function TaskDataTable({
  data: initialData,
  projectData,
  userData,

  create,
  update,
  deleteTask,
}: {
  data: z.infer<typeof taskSchema>[];
  projectData: z.infer<typeof projectSchema>[];
  userData: z.infer<typeof userSchema>[];

  create: (formData: FormData) => Promise<any>;
  update: (formData: FormData) => void;
  deleteTask: (id: string) => void;
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

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

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
    deleteTask(id);

    setData((prev) => prev.filter((item) => item._id !== id));
  };

  const columns: ColumnDef<z.infer<typeof taskSchema>>[] = [
    {
      accessorKey: "title",
      header: "Title",
      minSize: 300,
      size: 300,
      maxSize: Number.MAX_SAFE_INTEGER,
      cell: ({ row }) => {
        return (
          <TableCellViewer
            isNew={false}
            projectData={projectData}
            userData={userData}
            item={row.original}
            create={onCreate}
            update={onUpdate}
            onDelete={onDelete}
          />
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      // maxSize: 150,
      cell: ({ row }) => {
        const status = row.original.status as StatusEnum;

        const color = statusColorMap[status] || "default";

        return (
          <Badge variant="outline" className={color}>
            {status}
          </Badge>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "userAssigned",
      header: "Assignee",
      maxSize: 10,
      cell: ({ row }) => {
        const assignee = row.original.userAssigned;

        if (!assignee) return <div></div>;

        return (
          <div className="flex gap-2 items-center">
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage alt={assignee.name} />
              <AvatarFallback className="rounded-lg">
                {assignee.name[0]}
              </AvatarFallback>
            </Avatar>
            <p>{assignee.name}</p>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      maxSize: 30,
      cell: ({ row }) => {
        const priority = row.original.priority as PriorityEnum;

        const color = priorityColorMap[priority];

        return (
          <Badge variant="outline" className={color}>
            {priority}
          </Badge>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "project",
      header: "Project",
      maxSize: 30,
      cell: ({ row }) => {
        const project = row.original.project;

        return <div>{project?.name}</div>;
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
          projectData={projectData}
          userData={userData}
          isNew
          item={{ title: "", description: "", _id: "" }}
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
