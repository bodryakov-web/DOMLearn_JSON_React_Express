import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronLeft, ChevronRight, List, Moon, Sun, Code, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Sidebar from "@/components/sidebar";
import LessonContent from "@/components/lesson-content";
import TestSection from "@/components/test-section";

interface LessonParams {
  levelId: string;
  sectionId: string;
  lessonId: string;
}

export default function Lesson() {
  const params = useParams<LessonParams>();
  const { theme, setTheme } = useTheme();
  
  const { data: levelsStructure } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
  });

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["/api/lessons", params.levelId, params.sectionId, params.lessonId],
    queryFn: () => api.getLesson(params.levelId!, params.sectionId!, params.lessonId!),
    enabled: !!(params.levelId && params.sectionId && params.lessonId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold mb-4">Урок не найден</h1>
            <p className="text-muted-foreground mb-4">
              Урок еще не создан или произошла ошибка при загрузке.
            </p>
            <Link href="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLevel = levelsStructure?.levels.find(l => l.id === params.levelId);
  const currentPath = `/lesson/${params.levelId}/${params.sectionId}/${params.lessonId}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">JavaScript Learning</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              
              <Link href="/bod">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Админ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{currentLevel?.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Раздел</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-muted-foreground">
              {lesson.title}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar levelsStructure={levelsStructure} currentPath={currentPath} />
          </div>

          {/* Main Lesson Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-3xl">{lesson.title}</CardTitle>
                  <Badge variant="outline">
                    Урок {lesson.order}/10
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground">
                  {lesson.description}
                </p>
              </CardHeader>
            </Card>

            {/* Theory Section */}
            <LessonContent lesson={lesson} />

            {/* Test Section */}
            {lesson.tests.length > 0 && <TestSection tests={lesson.tests} />}

            {/* Tasks Section */}
            {lesson.tasks.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="h-6 w-6 text-primary mr-3" />
                    Практические задачи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {lesson.tasks.map((task, index) => (
                      <div key={task.id} className="p-4 border border-border rounded-lg">
                        <h3 className="font-semibold mb-2">Задача {index + 1}: {task.title}</h3>
                        <div 
                          className="mb-3 text-muted-foreground prose dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: task.description }}
                        />
                        {task.codeExample && (
                          <div className="code-block">
                            <pre>{task.codeExample}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <Button variant="ghost">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Предыдущий урок
                  </Button>
                  
                  <Link href="/">
                    <Button variant="outline">
                      <List className="h-4 w-4 mr-2" />
                      В оглавление
                    </Button>
                  </Link>
                  
                  <Button>
                    Следующий урок
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
