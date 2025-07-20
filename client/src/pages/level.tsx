import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Moon, Sun, Code, ChevronRight, ArrowLeft, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/mobile-navigation";

export default function LevelPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  
  const { data: levelsStructure, isLoading } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
  });

  const currentLevel = levelsStructure?.levels.find(level => level.id === levelId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка уровня...</p>
        </div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Уровень не найден</h1>
          <Link href="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MobileNavigation levelsStructure={levelsStructure} />
              <Code className="h-8 w-8 text-primary hidden md:block" />
              <h1 className="text-xl font-bold hidden md:block">JavaScript Learning</h1>
              <div className="md:hidden">
                <Code className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  На главную
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Header */}
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4">
            {levelId}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentLevel.title}</h1>
          <p className="text-lg text-muted-foreground">
            Выберите раздел для изучения
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentLevel.sections.map((sectionId, sectionIndex) => (
            <Card key={sectionId} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Раздел {sectionIndex + 1}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Изучите основы и выполните практические задания
                </p>
                
                {/* Sample lessons for preview */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">Уроки:</div>
                  <div className="space-y-1">
                    <Link href={`/lesson/${levelId}/${sectionId}/lesson1`}>
                      <div className="text-sm text-primary hover:underline">
                        → Урок 1
                      </div>
                    </Link>
                    <Link href={`/lesson/${levelId}/${sectionId}/lesson2`}>
                      <div className="text-sm text-primary hover:underline">
                        → Урок 2
                      </div>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      → И другие...
                    </div>
                  </div>
                </div>
                

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к списку уровней
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}