import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Settings, BookOpen, Edit, Plus } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("structure");

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

  const handleEditLesson = (levelId: string, sectionId: string, lessonId: string) => {
    setSelectedLevelId(levelId);
    setSelectedSectionId(sectionId);
    setSelectedLessonId(lessonId);
    setActiveTab("lessons");
  };

  const handleCreateNewLesson = () => {
    setSelectedLevelId("level1");
    setSelectedSectionId("section1");
    setSelectedLessonId("");
    setActiveTab("lessons");
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditLesson(level.id, level.sections[0], "lesson1")}
                          >
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
                              <h4 className="font-medium flex items-center justify-between">
                                Раздел {index + 1}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditLesson(level.id, sectionId, "lesson1")}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </h4>
                              <div className="text-sm text-muted-foreground mt-2">
                                <div 
                                  className="cursor-pointer hover:text-primary"
                                  onClick={() => handleEditLesson(level.id, sectionId, "lesson1")}
                                >
                                  • Урок 1
                                </div>
                                <div 
                                  className="cursor-pointer hover:text-primary"
                                  onClick={() => handleEditLesson(level.id, sectionId, "lesson2")}
                                >
                                  • Урок 2
                                </div>
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
                <CardTitle className="flex items-center justify-between">
                  Редактор уроков
                  <Button onClick={handleCreateNewLesson} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать урок
                  </Button>
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <Select value={selectedLevelId} onValueChange={setSelectedLevelId}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelsStructure?.levels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Выберите раздел" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedLevelId && levelsStructure?.levels
                        .find(l => l.id === selectedLevelId)?.sections
                        .map((sectionId, index) => (
                          <SelectItem key={sectionId} value={sectionId}>
                            Раздел {index + 1}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Выберите урок" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson1">Урок 1</SelectItem>
                      <SelectItem value="lesson2">Урок 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <RichTextEditor 
                  levelId={selectedLevelId}
                  sectionId={selectedSectionId}
                  lessonId={selectedLessonId}
                />
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
