import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, BookOpen, Edit } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const { data: levelsStructure } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token") || sessionStorage.getItem("admin-token");
    if (!adminToken) {
      setLocation("/bod");
    }
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("admin-token");
    sessionStorage.removeItem("admin-token");
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8" />
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <Badge variant="secondary" className="bg-amber-600">
                РЕЖИМ РЕДАКТИРОВАНИЯ
              </Badge>
            </div>
            
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-amber-600">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Структура курса</TabsTrigger>
            <TabsTrigger value="lessons">Редактор уроков</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>Структура курса</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levelsStructure?.levels.map((level) => (
                    <Card key={level.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            {level.title}
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Редактировать
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{level.description}</p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {level.sections.map((sectionId, index) => (
                            <div key={sectionId} className="p-3 border border-border rounded">
                              <h4 className="font-medium">Раздел {index + 1}</h4>
                              <div className="text-sm text-muted-foreground mt-2">
                                <div>• Урок 1</div>
                                <div>• Урок 2</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>Редактор уроков</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Настройки системы будут добавлены в следующих версиях.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
