import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function Combobox({ options, value, onChange, placeholder = "Select an option..." }) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // Create derived options list including the custom input if it doesn't match an existing option
    const exactMatch = options.find((opt) => opt.label.toLowerCase() === inputValue.toLowerCase());
    const customOption = inputValue && !exactMatch ? { id: inputValue, label: `Add "${inputValue}"` } : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal hover:bg-transparent"
                >
                    {value
                        ? options.find((option) => option.id === value)?.label || value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--select-trigger-width] p-0" align="start" sideOffset={4}>
                <Command>
                    <CommandInput
                        placeholder={`Search or add new...`}
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {inputValue ? (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-normal px-2"
                                    onClick={() => {
                                        onChange(inputValue);
                                        setOpen(false);
                                        setInputValue("");
                                    }}
                                >
                                    Add "{inputValue}"
                                </Button>
                            ) : (
                                "No options found."
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={(currentValue) => {
                                        // shadcn command item onSelect receives the lowercase value
                                        const selected = options.find((o) => o.label.toLowerCase() === currentValue);
                                        onChange(selected ? selected.id : currentValue);
                                        setOpen(false);
                                        setInputValue("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                            {customOption && (
                                <CommandItem
                                    key="custom-add"
                                    value={customOption.id}
                                    onSelect={() => {
                                        onChange(inputValue);
                                        setOpen(false);
                                        setInputValue("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === inputValue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {customOption.label}
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
