import { Lesson } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-6 w-6 text-primary mr-3" />
          Теоретический материал
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </CardContent>
    </Card>
  );
}
