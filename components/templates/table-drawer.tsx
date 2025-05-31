import React from "react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TableDrawerProps {
  buttonText: string | React.ReactNode;
  calssName?: string;
  children: React.ReactNode;
}

const TableDrawer: React.FC<TableDrawerProps> = ({
  buttonText,
  calssName,
  children,
}) => {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className={cn("w-fit !px-0 text-foreground text-left", calssName)}
        >
          {buttonText}
        </Button>
      </DrawerTrigger>

      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

export default TableDrawer;
