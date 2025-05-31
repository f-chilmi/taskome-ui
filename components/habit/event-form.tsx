import React from "react";
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import DatePickerController from "../templates/date-picker-controller";
import { cn } from "@/lib/utils";

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

function EventForm({ day }: { day: Date }) {
  const methods = useForm();
  const { setValue } = methods;

  return (
    <form className="flex flex-col gap-4">
      <DrawerHeader className="gap-1 flex flex-row items-center justify-between">
        <DrawerTitle>What happened today?</DrawerTitle>
        {/* <DrawerClose asChild>
                    <Trash2
                      color="red"
                      className="cursor-pointer"
                      onClick={() => deleteHabit(row.original._id)}
                    />
                  </DrawerClose> */}
      </DrawerHeader>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <Input placeholder="What event now?" id="name" defaultValue="" />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Date</Label>
          <div className="flex gap-4 items-center">
            <DatePickerController
              control={methods.control}
              defaultValue={day.toString()}
              name={"startDate"}
              placeholder={"Start date"}
            />
            <p>-</p>
            <DatePickerController
              control={methods.control}
              name={"endDate"}
              placeholder={"End date"}
              defaultValue={day.toString()}
              disabled={(date) => date < methods.watch("startDate")}
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
                  methods.watch("color") === color && "border-2 border-black"
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Type your description here."
            id="description"
            className="min-h-0 h-auto"
            defaultValue=""
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
  );
}

export default EventForm;
