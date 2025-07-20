import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Save 
} from "lucide-react";

export default function RichTextEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
    // This would save to the backend
    console.log("Saving lesson:", { title, description, content });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Lesson Meta */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Название урока</Label>
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
              <Button onClick={saveLesson} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Сохранить
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
