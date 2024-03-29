"use client";
import { useStoreModal } from "@/hooks/useStoreModal";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useTranslations } from "next-intl";
type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;
interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const t = useTranslations("Index");
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeid
  );

  const [open, setOpen] = useState(false);
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className={cn("w-[220px] justify-between", className)}
        >
          <StoreIcon className="me-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ms-auto h-4 w-4  opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder={t("SearchStore")} />
            <CommandEmpty>{t("NoStoreFound")}</CommandEmpty>
            <CommandGroup heading={t("Stores")}>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="me-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ms-auto h-3 w-3",
                      currentStore?.value === store.value
                        ? " opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="me-2 h-4 w-4" />
                {t("Create Store")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
