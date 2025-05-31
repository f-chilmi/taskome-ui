"use client";

import * as React from "react";
import {
  ColumnDef,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { habitSchema } from "@/types/schemas";
import { format, getDaysInMonth, setDate } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import TableDrawer from "../templates/table-drawer";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Textarea } from "../ui/textarea";
import { Trash2 } from "lucide-react";
import { RowData } from "@tanstack/react-table";
import "@tanstack/react-table";
import { Habit, RepetitionEnum } from "@/types";
import { Controller } from "react-hook-form";
import EventForm from "./event-form";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export function HabitDataTable({
  selectedDate,
  data: initialData,
  updateLog,
  createHabit,
  deleteHabit,
}: {
  selectedDate: Date;
  data: Habit[];
  updateLog: (payload: string) => void;
  createHabit: (payload: string) => void;
  deleteHabit: (id: string) => void;
}) {
  const [data, setData] = React.useState<Habit[]>([]);

  React.useEffect(() => {
    setData([
      ...initialData,
      {
        _id: "new",
        userId: "",
        name: "",
        repeat: RepetitionEnum.DAILY,
        habitLogs: {},
      },
    ]);
  }, [initialData]);

  const columns = React.useMemo<
    ColumnDef<z.infer<typeof habitSchema>>[]
  >(() => {
    const onCreateHabit = (name: string) =>
      createHabit(JSON.stringify({ name }));
    const onUpdateLog = (habitId: string, date: number, isChecked: boolean) => {
      const now = new Date();
      const payload = {
        habitId,
        date: format(
          new Date(now.getFullYear(), now.getMonth(), date),
          "yyyy-MM-dd"
        ),
        isChecked,
      };

      updateLog(JSON.stringify(payload));
    };
    const dateColumns = Array.from(
      { length: getDaysInMonth(new Date()) },
      (_, i) => {
        const day = i + 1;
        return {
          id: day.toString(),
          accessorKey: "habitLogs" + day,
          header: () => {
            const date = setDate(selectedDate, day);
            const dayLetter = format(date, "EE").toLowerCase();
            return (
              <TableDrawer
                calssName="px-2"
                buttonText={
                  <div className="flex flex-col items-center ">
                    <span className="text-[10px] text-gray-400">
                      {dayLetter}
                    </span>
                    <span>{day}</span>
                  </div>
                }
              >
                <EventForm day={setDate(selectedDate, day)} />
              </TableDrawer>
            );
          },

          cell: ({ row }) => {
            const isChecked = row.original.habitLogs[day];
            return (
              <ButtonCheck
                isChecked={isChecked}
                disabled={row.original._id === "new"}
                className="flex justify-self-center"
                onUpdateLog={() => {
                  onUpdateLog(row.original._id, day, !isChecked);
                }}
              />
            );
          },
        };
      }
    );

    return [
      {
        id: "name",
        accessorKey: "name",
        enablePinning: true,
        header: "Activity",
        meta: {
          className: "sticky left-0 bg-white",
        },

        cell: ({ row }) => {
          if (row.original._id === "new")
            return (
              <Input
                placeholder="Press enter"
                name="name"
                className="border-none focus-visible:border-none focus-visible:ring-ring/0 focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onCreateHabit(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            );
          return (
            <TableDrawer calssName="px-2" buttonText={row.original.name}>
              <form className="flex flex-col gap-4">
                <DrawerHeader className="gap-1 flex flex-row items-center justify-between">
                  <DrawerTitle>{row.original.name}</DrawerTitle>
                  <DrawerClose asChild>
                    <Trash2
                      color="red"
                      className="cursor-pointer"
                      onClick={() => deleteHabit(row.original._id)}
                    />
                  </DrawerClose>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name">Activity Name</Label>
                    <Input id="name" defaultValue={row.original.name} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      placeholder="Type your description here."
                      id="description"
                      className="min-h-0 h-auto"
                      defaultValue={row.original.description}
                      rows={5}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button type="submit">Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </TableDrawer>
          );
        },
        enableHiding: false,
      },
      ...dateColumns,
    ];
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {},
    getRowId: (row) => row._id.toString(),
    enableRowSelection: true,
    enableColumnPinning: true,
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
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.columnDef.meta?.className ?? ""
                        }
                      >
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className ?? ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
        </div>
      </div>
    </div>
  );
}

function ButtonCheck({
  isChecked,
  disabled,
  onUpdateLog,
  className,
}: {
  isChecked: boolean;
  disabled: boolean;
  onUpdateLog: () => void;
  className: string;
}) {
  return (
    <button
      onClick={() => onUpdateLog()}
      disabled={disabled}
      className={cn(
        "w-6 h-6 bg-secondary align-bottom rounded-sm",
        isChecked && "bg-secondary-foreground ",
        !disabled && "cursor-pointer",
        !disabled && (isChecked ? "hover:bg-gray-600" : "hover:bg-gray-400"),
        className
      )}
    ></button>
  );
}
