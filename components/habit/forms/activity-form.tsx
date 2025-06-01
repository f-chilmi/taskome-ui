import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Habit } from "@/types";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";

function ActivityForm({
  row,
  deleteHabit,
}: {
  deleteHabit: (id: string) => void;
  row: Row<Habit>;
}) {
  return (
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
  );
}

export default ActivityForm;
