import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, BookOpen } from "lucide-react";
import { LevelsStructure } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavigationProps {
  levelsStructure?: LevelsStructure;
}

export default function MobileNavigation({ levelsStructure }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!levelsStructure) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Уровни обучения</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {levelsStructure.levels.map((level) => (
            <Link 
              key={level.id} 
              href={`/level/${level.id}`}
              onClick={() => setIsOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto text-left"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{level.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {level.sections.length} разделов
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}