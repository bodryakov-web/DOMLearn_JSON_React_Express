import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminUserSchema, type AdminUser } from "@shared/schema";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LogOut, Settings, BookOpen, Edit, Plus, Save, Pencil, Users } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("structure");
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editingLevelTitle, setEditingLevelTitle] = useState("");

  const { data: levelsStructure } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: () => api.getLevelsStructure(),
    enabled: isAuthenticated === true,
  });

  const form = useForm<AdminUser>({
    resolver: zodResolver(AdminUserSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check admin authentication on mount
  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token") || sessionStorage.getItem("admin-token");
    setIsAuthenticated(!!adminToken);
  }, []);

  const onSubmit = async (values: AdminUser) => {
    setIsLoggingIn(true);
    try {
      const result = await api.adminLogin(values.username, values.password);
      
      if (result.success) {
        // Store admin token
        if (values.rememberMe) {
          localStorage.setItem("admin-token", result.token || "");
        } else {
          sessionStorage.setItem("admin-token", result.token || "");
        }
        
        setIsAuthenticated(true);
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель!",
        });
      } else {
        throw new Error("Неверные данные для входа");
      }
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-token");
    sessionStorage.removeItem("admin-token");
    setIsAuthenticated(false);
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

  const startEditingLevel = (levelId: string, currentTitle: string) => {
    setEditingLevelId(levelId);
    setEditingLevelTitle(currentTitle);
  };

  const cancelEditingLevel = () => {
    setEditingLevelId(null);
    setEditingLevelTitle("");
  };

  // Мутация для обновления названия уровня
  const updateLevelMutation = useMutation({
    mutationFn: ({ levelId, title }: { levelId: string; title: string }) => 
      api.updateLevel(levelId, { title }),
    onSuccess: () => {
      toast({
        title: "Уровень обновлен",
        description: "Название уровня успешно изменено",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/levels"] });
      setEditingLevelId(null);
      setEditingLevelTitle("");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить название уровня",
        variant: "destructive",
      });
    },
  });

  const saveLevel = () => {
    if (!editingLevelId || !editingLevelTitle.trim()) {
      toast({
        title: "Ошибка",
        description: "Название не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    updateLevelMutation.mutate({ levelId: editingLevelId, title: editingLevelTitle });
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Вход в админ-панель</CardTitle>
            <p className="text-muted-foreground">
              Введите учетные данные для доступа к панели управления
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логин</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите логин" disabled={isLoggingIn} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="Введите пароль" 
                          disabled={isLoggingIn}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoggingIn}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Запомнить меня
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Вход..." : "Войти"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structure">Структура курса</TabsTrigger>
            <TabsTrigger value="levels">Управление уровнями</TabsTrigger>
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
                          <div 
                            className="flex items-center cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleEditLesson(level.id, level.sections[0], "lesson1")}
                          >
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
                            <div key={sectionId} className="p-3 border border-border rounded hover:bg-accent/50 transition-colors">
                              <h4 
                                className="font-medium flex items-center justify-between cursor-pointer"
                                onClick={() => handleEditLesson(level.id, sectionId, "lesson1")}
                              >
                                <span className="hover:text-primary transition-colors">
                                  Раздел {index + 1}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditLesson(level.id, sectionId, "lesson1");
                                  }}
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

          <TabsContent value="levels">
            <Card>
              <CardHeader>
                <CardTitle>Управление уровнями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levelsStructure?.levels.map((level) => (
                    <Card key={level.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {editingLevelId === level.id ? (
                            <div className="flex items-center space-x-2 w-full">
                              <Input
                                value={editingLevelTitle}
                                onChange={(e) => setEditingLevelTitle(e.target.value)}
                                className="flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveLevel();
                                  if (e.key === 'Escape') cancelEditingLevel();
                                }}
                                autoFocus
                              />
                              <Button
                                onClick={saveLevel}
                                size="sm"
                                disabled={updateLevelMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={cancelEditingLevel}
                                variant="outline"
                                size="sm"
                                disabled={updateLevelMutation.isPending}
                              >
                                Отмена
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <BookOpen className="h-5 w-5 mr-2" />
                                {level.title}
                              </div>
                              <Button
                                onClick={() => startEditingLevel(level.id, level.title)}
                                variant="outline"
                                size="sm"
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Изменить название
                              </Button>
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{level.description}</p>
                        <div className="mt-4 text-sm">
                          <strong>Разделов:</strong> {level.sections.length}
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
