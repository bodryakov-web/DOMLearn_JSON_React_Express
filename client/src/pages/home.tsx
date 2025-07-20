import { useQuery } from "@tanstack/react-query";
import { Moon, Sun, Code, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { data: levelsStructure, isLoading } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка курсов...</p>
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
            
            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - only on desktop */}
          <div className="lg:col-span-1 hidden md:block">
            <Sidebar levelsStructure={levelsStructure} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 md:col-span-1">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Изучение JavaScript</h1>
              <p className="text-xl text-muted-foreground">
                Комплексный курс для изучения JavaScript с нуля до продвинутого уровня
              </p>
            </div>

            {/* Mobile Level Cards */}
            <div className="md:hidden mb-8">
              <h2 className="text-2xl font-semibold mb-4">Выберите уровень</h2>
              <div className="grid gap-4">
                {levelsStructure?.levels.map((level) => (
                  <Link key={level.id} href={`/level/${level.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span>{level.title}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          {level.sections.length} разделов для изучения
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Levels Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {levelsStructure?.levels.map((level) => (
                <Card key={level.id} className="lesson-card hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {level.title}
                      <Badge variant="outline">
                        {level.sections.length} раздела
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{level.description}</p>
                    
                    {/* Progress bar placeholder */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Прогресс</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full progress-bar"
                          style={{ "--progress": "0%" } as any}
                        ></div>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-2">
                      {level.sections.map((sectionId, index) => (
                        <div
                          key={sectionId}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                        >
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">Раздел {index + 1}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
