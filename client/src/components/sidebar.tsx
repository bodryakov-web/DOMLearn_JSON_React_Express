import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react";
import { LevelsStructure } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  levelsStructure?: LevelsStructure;
  currentPath?: string;
}

export default function Sidebar({ levelsStructure, currentPath }: SidebarProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['level1']));

  const toggleLevel = (levelId: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId);
    } else {
      newExpanded.add(levelId);
    }
    setExpandedLevels(newExpanded);
  };

  if (!levelsStructure) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Уровни обучения</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {levelsStructure.levels.map((level) => (
            <div key={level.id}>
              <Collapsible
                open={expandedLevels.has(level.id)}
                onOpenChange={() => toggleLevel(level.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{level.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {level.sections.length} разделов
                        </div>
                      </div>
                    </div>
                    {expandedLevels.has(level.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="pl-6 pb-2 space-y-1">
                    {level.sections.map((sectionId, sectionIndex) => (
                      <div key={sectionId} className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground px-2 py-1">
                          📚 Раздел {sectionIndex + 1}
                        </div>
                        
                        {/* Sample lessons for each section */}
                        <div className="pl-4 space-y-1">
                          <Link href={`/lesson/${level.id}/${sectionId}/lesson1`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              Урок 1
                            </Button>
                          </Link>
                          <Link href={`/lesson/${level.id}/${sectionId}/lesson2`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              Урок 2
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
