"use client";

import React, { useEffect, useState } from "react";

import { Event, Habit } from "@/types";
import { toast } from "sonner";
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import DatePickerController from "@/components/templates/date-picker-controller";
import {
  ComboboxWithCreate,
  ComboboxOptions,
} from "@/components/ui/combobox-with-create";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldValues, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const pastelColors = [
  "#b3d9ff",
  "#ffb3d9",
  "#b3ffb3",
  "#d9b3ff",
  "#ffcc99",
  "#ffff99",
  "#99e6e6",
  "#ccb3ff",
  "#ffb399",
  "#99ffcc",
];

function EventForm({
  day,
  events,
  habits,

  createEvent,
}: {
  day: Date;
  events: Event[];
  habits: Habit[];

  createEvent: (payload: string) => void;
}) {
  const [eventOptions, setEventOptions] = useState(
    events.map((e) => ({ label: e.name, value: e._id }))
  );
  const [defaultValues, setDefaultValue] = useState<Event>();

  const methods = useForm<FieldValues>({
    values: { ...defaultValues, name: defaultValues?._id },
  });
  const { setValue, watch, getValues, reset, register } = methods;

  useEffect(() => {
    function getTodayEvent() {
      const todayStr = day.toISOString().slice(0, 10); // 'YYYY-MM-DD'

      const todayEvent = events.find((e) =>
        e.dates.some((d) => new Date(d).toISOString().slice(0, 10) === todayStr)
      );

      if (todayEvent) {
        setDefaultValue({
          ...todayEvent,
          startDate: todayEvent.dates[0],
          endDate: todayEvent.dates[todayEvent.dates.length - 1],
        });
        return todayEvent;
      }

      return null;
    }
    getTodayEvent();

    return () => {
      reset();
    };
  }, [day]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name =
      getValues("name") === defaultValues?._id
        ? defaultValues?.name
        : getValues("name");
    const payload = JSON.stringify({
      ...getValues(),
      name,
    });

    try {
      await createEvent(payload);

      toast.success("Create event success!");
    } catch (err) {
      toast.error(
        (err as { message: string }).message || "Create event failed!"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DrawerHeader className="gap-1 flex flex-row items-center justify-between">
        <DrawerTitle>What happened today?</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <ComboboxWithCreate
            options={eventOptions}
            optionToCreate
            selected={watch("name") ?? ""} // string or array
            onChange={(value) =>
              setValue("name", (value as ComboboxOptions).value)
            }
            onCreate={(value) => {
              setEventOptions((o) => [...o, { label: value, value }]);
              setValue("name", value);
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Date</Label>
          <div className="flex gap-4 items-center">
            <DatePickerController
              control={methods.control}
              defaultValue={day}
              name={"startDate"}
              placeholder={"Start date"}
            />
            <p>-</p>
            <DatePickerController
              control={methods.control}
              name={"endDate"}
              placeholder={"End date"}
              defaultValue={day}
              disabled={(date) => date < watch("startDate")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Color Option</Label>
          <div className="flex gap-2">
            {pastelColors.map((color, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-full cursor-pointer w-7 h-7",
                  watch("color") === color && "border-2 border-black"
                )}
                style={{ background: color }}
                onClick={() => {
                  setValue("color", color);
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Some habits to disable</Label>
          <ComboboxWithCreate
            multiselect
            optionToCreate={false}
            options={habits
              .filter((h) => h._id !== "new")
              .map((h) => ({ label: h.name, value: h._id }))}
            selected={watch("disabledHabitIds")} // string or array
            onChange={(value) => {
              setValue("disabledHabitIds", value as string[]);
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="description">Note</Label>
          <Textarea
            placeholder="Type your description here."
            id="note"
            className="min-h-0 h-auto"
            defaultValue=""
            rows={5}
            {...register("note")}
          />
        </div>
      </div>

      <DrawerFooter>
        <DrawerClose asChild>
          <Button type="submit">Submit</Button>
        </DrawerClose>

        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
}

export default EventForm;
