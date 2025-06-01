import React from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Control, Controller, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Matcher } from "react-day-picker";

function DatePickerController({
  control,
  name,
  placeholder = "Pick a date",
  defaultValue,
  disabled,
}: {
  control: Control<FieldValues, unknown, FieldValues>;
  name: string;
  placeholder: string;
  defaultValue?: Date;
  disabled?: Matcher | Matcher[];
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Popover modal>
          <PopoverTrigger asChild>
            <Button
              id="dueDate"
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white border rounded"
            align="start"
          >
            <Calendar
              mode="single"
              selected={field.value as Date}
              onSelect={field.onChange}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}

export default DatePickerController;
