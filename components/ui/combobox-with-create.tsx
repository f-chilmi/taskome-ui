import { useEffect, useState } from "react";

import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOptions = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOptions[];
  selected: ComboboxOptions["value"] | ComboboxOptions["value"][];
  multiselect?: boolean;
  className?: string;
  placeholder?: string;
  disalbed?: boolean;
  optionToCreate?: boolean;
  onChange: (option: ComboboxOptions | ComboboxOptions["value"][]) => void;
  onCreate?: (label: ComboboxOptions["label"]) => void;
}

function CommandAddItem({
  query,
  onCreate,
}: {
  query: string;
  onCreate: () => void;
}) {
  return (
    <div
      tabIndex={0}
      onClick={onCreate}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
          onCreate();
        }
      }}
      className={cn(
        "flex w-full text-blue-500 cursor-pointer text-sm px-2 py-1.5 rounded-sm items-center focus:outline-none",
        "hover:bg-blue-200 focus:!bg-blue-200"
      )}
    >
      <CirclePlus className="mr-2 h-4 w-4" />
      Create &ldquo;{query}&ldquo;
    </div>
  );
}

export function ComboboxWithCreate({
  options,
  selected,
  className,
  placeholder,
  disalbed,
  optionToCreate,
  multiselect,
  onChange,
  onCreate,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [canCreate, setCanCreate] = useState(true);
  useEffect(() => {
    const isAlreadyCreated = !options.some((option) => option.label === query);
    setCanCreate(!!(query && isAlreadyCreated));
  }, [query, options]);

  function handleSelect(option: ComboboxOptions) {
    if (onChange) {
      if (multiselect) {
        const currentSelected = Array.isArray(selected) ? selected : [];
        const isSelected = currentSelected.includes(option.value);
        const newSelected = isSelected
          ? currentSelected.filter((v) => v !== option.value)
          : [...currentSelected, option.value];
        onChange(newSelected);
      } else {
        onChange(option);
        setOpen(false);
      }
      setQuery("");
    }
  }

  function handleCreate() {
    if (onCreate && query) {
      onCreate(query);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disalbed ?? false}
          aria-expanded={open}
          className={cn("w-full font-normal", className)}
        >
          {/* {selected && selected.length > 0 ? (
            <div className="truncate mr-auto">
              {options.find((item) => item.value === selected)?.label}
            </div>
          ) : (
            <div className="text-slate-600 mr-auto">
              {placeholder ?? "Select"}
            </div>
          )} */}
          {multiselect && Array.isArray(selected) && selected.length > 0 ? (
            <div className="truncate mr-auto">{selected.length} selected</div>
          ) : !multiselect &&
            selected &&
            typeof selected === "string" &&
            selected.length > 0 ? (
            <div className="truncate mr-auto">
              {options.find((item) => item.value === selected)?.label}
            </div>
          ) : (
            <div className="text-slate-600 mr-auto">
              {placeholder ?? "Select"}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command
          filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder={`Search ${optionToCreate ? "or create new" : ""}`}
            value={query}
            onValueChange={(value: string) => setQuery(value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          />
          {optionToCreate && (
            <CommandEmpty className="flex pl-1 py-1 w-full">
              {query && (
                <CommandAddItem query={query} onCreate={() => handleCreate()} />
              )}
            </CommandEmpty>
          )}

          <CommandList>
            <CommandGroup className="overflow-y-auto">
              {options.length === 0 && !query && (
                <div className="py-1.5 pl-8 space-y-1 text-sm">
                  <p>No items</p>
                  <p>Enter a value to create a new one</p>
                </div>
              )}

              {optionToCreate && canCreate && (
                <CommandAddItem query={query} onCreate={() => handleCreate()} />
              )}

              {options.map((option) => (
                <CommandItem
                  key={option.label}
                  tabIndex={0}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();

                      handleSelect(option);
                    }
                  }}
                  className={cn(
                    "cursor-pointer",

                    "focus:!bg-blue-200 hover:!bg-blue-200 aria-selected:bg-transparent"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 min-h-4 min-w-4",
                      multiselect
                        ? Array.isArray(selected) &&
                          selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                        : selected === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
