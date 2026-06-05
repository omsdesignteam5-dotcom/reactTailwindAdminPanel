import React from "react";

//Utils
import { cn } from "src/utils/utils";

type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "flex w-full items-stretch rounded-md border border-input bg-background overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement>;

function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
  return (
    <div
      className={cn(
        "flex items-center px-3 text-sm text-muted-foreground bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon };
