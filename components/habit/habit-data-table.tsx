/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, getDaysInMonth, setDate } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import TableDrawer from "../templates/table-drawer";
import { Event, Habit, RepetitionEnum } from "@/types";
import ActivityForm from "./forms/activity-form";
import EventForm from "./forms/event-form";

export function HabitDataTable({
  selectedDate,
  data: initialData,
  events,
  updateLog,
  createHabit,
  deleteHabit,
  createEvent,
}: {
  selectedDate: Date;
  data: Habit[];
  events: Event[];
  updateLog: (payload: string) => void;
  createHabit: (payload: string) => void;
  createEvent: (payload: string) => void;
  deleteHabit: (id: string) => void;
}) {
  // const [data, setData] = React.useState<Habit[]>([]);
  // console.log(data);
  // React.useEffect(() => {
  //   const newData: Habit = {
  //     _id: "new",
  //     userId: "",
  //     name: "new",
  //     repeat: RepetitionEnum.DAILY,
  //     habitLogs: {},
  //   };
  //   setData([...initialData, newData]);
  // }, [initialData]);
  const data = React.useMemo(() => {
    const newRow: Habit = {
      _id: "new",
      userId: "",
      name: "new",
      repeat: RepetitionEnum.DAILY,
      habitLogs: {},
    };
    return [...initialData, newRow];
  }, [initialData]);

  const columns = React.useMemo<ColumnDef<Habit>[]>(() => {
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
      { length: getDaysInMonth(selectedDate) },
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
                buttonText={
                  <div className="flex flex-col items-center ">
                    <span className="text-[10px] text-gray-400">
                      {dayLetter}
                    </span>
                    <span>{day}</span>
                  </div>
                }
              >
                <EventForm
                  events={events}
                  day={setDate(selectedDate, day)}
                  habits={initialData}
                  createEvent={createEvent}
                />
              </TableDrawer>
            );
          },

          cell: ({ row }: { row: any }) => {
            const date = setDate(selectedDate, day);
            const isChecked = row.original.habitLogs[day];
            let isDisabled = false;

            const currentEvent = getTodayEvent(date, events);
            if (currentEvent?.disabledHabitIds.includes(row.original._id))
              isDisabled = true;
            else if (row.original._id === "new") isDisabled = true;
            else isDisabled = false;

            return (
              <div style={{ background: currentEvent?.color }}>
                <ButtonCheck
                  isChecked={isChecked}
                  disabled={isDisabled}
                  className="flex justify-self-center disabled:cursor-not-allowed"
                  onUpdateLog={() => {
                    onUpdateLog(row.original._id, day, !isChecked);
                  }}
                />
              </div>
            );
          },
        };
      }
    );

    return [
      {
        id: "name",
        // accessorKey: "name",
        accessorFn: (row) => row.name,
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
            <TableDrawer className="px-2" buttonText={row.original.name}>
              <ActivityForm deleteHabit={deleteHabit} row={row} />
            </TableDrawer>
          );
        },
        enableHiding: false,
      },
      ...dateColumns,
    ];
  }, [initialData, selectedDate, events]);
  console.log(data);
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: data.length,
      },
    },
    enableRowSelection: true,
    enableColumnPinning: true,
    getRowId: (row) => row._id,
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
                          (header.column.columnDef.meta as any)?.className ?? ""
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
                        className={
                          (cell.column.columnDef.meta as any)?.className ?? ""
                        }
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

function getTodayEvent(date: Date, events: Event[]) {
  const todayStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const todayEvent = events.find((e) =>
    e.dates.some((d) => new Date(d).toISOString().slice(0, 10) === todayStr)
  );

  if (todayEvent) {
    return todayEvent;
  }

  return null;
}
