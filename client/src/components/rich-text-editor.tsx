import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading, 
  List, 
  Link, 
  Image, 
  Video, 
  Table, 
  Code, 
  Save,
  Plus,
  Trash2
} from "lucide-react";

interface RichTextEditorProps {
  levelId?: string;
  sectionId?: string;
  lessonId?: string;
}

export default function RichTextEditor({ levelId, sectionId, lessonId }: RichTextEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tests, setTests] = useState([{ id: "q1", question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  const [tasks, setTasks] = useState([{ id: "task1", title: "", description: "", codeExample: "" }]);
  const [order, setOrder] = useState(1);

  // Загружаем урок, если указаны все параметры
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", levelId, sectionId, lessonId],
    queryFn: () => api.getLesson(levelId!, sectionId!, lessonId!),
    enabled: !!(levelId && sectionId && lessonId),
  });

  // Заполняем поля при загрузке урока
  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setDescription(lesson.description);
      setContent(lesson.content);
      setTests(lesson.tests.length > 0 ? lesson.tests : [{ id: "q1", question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      setTasks(lesson.tasks.length > 0 ? lesson.tasks : [{ id: "task1", title: "", description: "", codeExample: "" }]);
      setOrder(lesson.order);
    }
  }, [lesson]);

  // Мутация для сохранения урока
  const saveMutation = useMutation({
    mutationFn: (lessonData: any) => {
      if (lessonId) {
        return api.saveLesson(levelId!, sectionId!, lessonId, lessonData);
      } else {
        const newLessonId = `lesson${Date.now()}`;
        return api.createLesson(levelId!, sectionId!, { ...lessonData, id: newLessonId });
      }
    },
    onSuccess: () => {
      toast({
        title: "Урок сохранен",
        description: "Изменения успешно сохранены",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить урок",
        variant: "destructive",
      });
    },
  });

  const toolbarButtons = [
    { icon: Bold, label: "Жирный" },
    { icon: Italic, label: "Курсив" },
    { icon: Underline, label: "Подчеркнутый" },
    { icon: Heading, label: "Заголовок" },
    { icon: List, label: "Список" },
    { icon: Link, label: "Ссылка" },
    { icon: Image, label: "Изображение" },
    { icon: Video, label: "Видео" },
    { icon: Table, label: "Таблица" },
    { icon: Code, label: "Код" },
  ];

  const insertCode = () => {
    const codeExample = `<div class="code-block">
<span class="syntax-keyword">let</span> variable = <span class="syntax-string">"Hello World"</span>;
<span class="syntax-comment">// This is a comment</span>
</div>`;
    
    setContent(prev => prev + codeExample);
  };

  const saveLesson = () => {
    if (!levelId || !sectionId || !title.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    const lessonData = {
      id: lessonId || `lesson${Date.now()}`,
      title,
      description,
      content,
      tests,
      tasks,
      order,
    };

    saveMutation.mutate(lessonData);
  };

  const addTest = () => {
    const newTest = {
      id: `q${tests.length + 1}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    setTests([...tests, newTest]);
  };

  const removeTest = (index: number) => {
    if (tests.length > 1) {
      setTests(tests.filter((_, i) => i !== index));
    }
  };

  const updateTest = (index: number, field: string, value: any) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setTests(updatedTests);
  };

  const updateTestOption = (testIndex: number, optionIndex: number, value: string) => {
    const updatedTests = [...tests];
    updatedTests[testIndex].options[optionIndex] = value;
    setTests(updatedTests);
  };

  const addTask = () => {
    const newTask = {
      id: `task${tasks.length + 1}`,
      title: "",
      description: "",
      codeExample: ""
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Загрузка урока...</span>
      </div>
    );
  }

  if (!levelId || !sectionId) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Выберите уровень и раздел для редактирования урока
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Meta */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Название урока *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название урока"
          />
        </div>
        <div>
          <Label htmlFor="description">Описание урока</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание урока"
          />
        </div>
        <div>
          <Label htmlFor="order">Порядковый номер</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            placeholder="1"
            min="1"
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Содержимое урока
            <div className="flex items-center space-x-2">
              {/* Toolbar */}
              <div className="flex items-center space-x-1 bg-muted p-2 rounded-lg">
                {toolbarButtons.map(({ icon: Icon, label }, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={label === "Код" ? insertCode : undefined}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              <Button 
                onClick={saveLesson} 
                disabled={saveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="rich-editor min-h-96"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите содержимое урока. Используйте HTML для форматирования..."
          />
        </CardContent>
      </Card>

      {/* Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Тестовые вопросы
            <Button onClick={addTest} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Добавить вопрос
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tests.map((test, index) => (
            <div key={test.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Вопрос {index + 1}</h4>
                {tests.length > 1 && (
                  <Button
                    onClick={() => removeTest(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label>Текст вопроса</Label>
                <Input
                  value={test.question}
                  onChange={(e) => updateTest(index, 'question', e.target.value)}
                  placeholder="Введите текст вопроса"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Варианты ответов</Label>
                {test.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <span className="w-8 text-sm font-medium">{optionIndex + 1}.</span>
                    <Input
                      value={option}
                      onChange={(e) => updateTestOption(index, optionIndex, e.target.value)}
                      placeholder={`Вариант ${optionIndex + 1}`}
                      className={test.correctAnswer === optionIndex ? "border-green-500" : ""}
                    />
                    <Button
                      onClick={() => updateTest(index, 'correctAnswer', optionIndex)}
                      variant={test.correctAnswer === optionIndex ? "default" : "outline"}
                      size="sm"
                    >
                      {test.correctAnswer === optionIndex ? "Правильный" : "Отметить"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Практические задачи
            <Button onClick={addTask} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Добавить задачу
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tasks.map((task, index) => (
            <div key={task.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Задача {index + 1}</h4>
                {tasks.length > 1 && (
                  <Button
                    onClick={() => removeTask(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label>Название задачи</Label>
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  placeholder="Введите название задачи"
                />
              </div>
              
              <div>
                <Label>Описание задачи</Label>
                <Textarea
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  placeholder="Опишите что нужно сделать"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Пример кода (необязательно)</Label>
                <Textarea
                  value={task.codeExample}
                  onChange={(e) => updateTask(index, 'codeExample', e.target.value)}
                  placeholder="// Пример кода или шаблон для решения"
                  rows={4}
                  className="font-mono"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      {content && (
        <Card>
          <CardHeader>
            <CardTitle>Предварительный просмотр</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
