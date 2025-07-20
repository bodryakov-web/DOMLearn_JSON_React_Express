import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Moon, Sun, Code, ChevronRight, ArrowLeft, BookOpen, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/mobile-navigation";

export default function SectionPage() {
  const { levelId, sectionId } = useParams<{ levelId: string; sectionId: string }>();
  const { theme, setTheme } = useTheme();
  
  const { data: levelsStructure, isLoading } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
  });

  const currentLevel = levelsStructure?.levels.find(level => level.id === levelId);
  const sectionIndex = currentLevel?.sections.findIndex(s => s === sectionId) ?? -1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка раздела...</p>
        </div>
      </div>
    );
  }

  if (!currentLevel || sectionIndex === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Раздел не найден</h1>
          <Link href={`/level/${levelId}`}>
            <Button>Вернуться к уровню</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock lessons data for demonstration
  const mockLessons = [
    { id: 'lesson1', title: 'Введение в тему', completed: false },
    { id: 'lesson2', title: 'Основные концепции', completed: false },
    { id: 'lesson3', title: 'Практические примеры', completed: false },
    { id: 'lesson4', title: 'Упражнения', completed: false },
    { id: 'lesson5', title: 'Тест по разделу', completed: false },
  ];

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
              <Link href={`/level/${levelId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">К уровню</span>
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
        {/* Section Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="secondary">{levelId}</Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">Раздел {sectionIndex + 1}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Раздел {sectionIndex + 1}
          </h1>
          <p className="text-lg text-muted-foreground">
            {currentLevel.title}
          </p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">Уроки</h2>
          
          {mockLessons.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Урок {index + 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {lesson.completed && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Завершено
                      </Badge>
                    )}
                    
                    <Link href={`/lesson/${levelId}/${sectionId}/${lesson.id}`}>
                      <Button>
                        {lesson.completed ? 'Повторить' : 'Начать'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link href={`/level/${levelId}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к уровню
            </Button>
          </Link>
          
          <Link href={`/lesson/${levelId}/${sectionId}/lesson1`}>
            <Button>
              Начать первый урок
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}