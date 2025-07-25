import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: Option[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full bg-background hover:bg-black hover:text-white justify-start">
          {selected.length > 0 ? (
            <span>{selected.join(", ")}</span>
          ) : (
            <span className="text-muted-foreground">Select skills</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command className="bg-black text-white custom-scrollbar">
          <CommandInput className="text-white bg-black" placeholder="Search skills..." />
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleValue(option.value)}
                className="cursor-pointer"
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
