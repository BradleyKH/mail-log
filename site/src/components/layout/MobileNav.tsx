import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SiteNav from "./SiteNav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-background">
        <SheetHeader>
          <SheetTitle className="font-mono tracking-widest">MAIL LOG</SheetTitle>
          <SheetDescription className="sr-only">Site sections</SheetDescription>
        </SheetHeader>
        <SiteNav className="flex flex-col gap-1 px-2" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
