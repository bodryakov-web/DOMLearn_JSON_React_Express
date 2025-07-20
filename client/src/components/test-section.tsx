import { useState } from "react";
import { TestQuestion } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

interface TestSectionProps {
  tests: TestQuestion[];
}

export default function TestSection({ tests }: TestSectionProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetTest = () => {
    setAnswers({});
    setShowResults(false);
  };

  const correctAnswers = tests.filter(test => answers[test.id] === test.correctAnswer).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-primary mr-3" />
            Тестирование
          </div>
          {showResults && (
            <div className="text-lg font-semibold">
              Результат: {correctAnswers}/{tests.length}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tests.map((test, index) => (
            <div key={test.id} className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                Вопрос {index + 1}: {test.question}
                {showResults && (
                  <span className="ml-2">
                    {answers[test.id] === test.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                )}
              </h3>
              
              <RadioGroup
                value={answers[test.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(test.id, parseInt(value))}
                disabled={showResults}
              >
                {test.options.map((option, optionIndex) => {
                  const isSelected = answers[test.id] === optionIndex;
                  const isCorrect = test.correctAnswer === optionIndex;
                  
                  let className = "flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-muted/50";
                  
                  if (showResults) {
                    if (isCorrect) {
                      className += " border-green-500 bg-green-50 dark:bg-green-900/20";
                    } else if (isSelected && !isCorrect) {
                      className += " border-red-500 bg-red-50 dark:bg-red-900/20";
                    }
                  } else if (isSelected) {
                    className += " border-primary bg-primary/10";
                  }
                  
                  return (
                    <div key={optionIndex} className={className}>
                      <RadioGroupItem value={optionIndex.toString()} id={`${test.id}-${optionIndex}`} />
                      <Label htmlFor={`${test.id}-${optionIndex}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          {!showResults ? (
            <Button onClick={checkAnswers} disabled={Object.keys(answers).length !== tests.length}>
              Проверить ответы
            </Button>
          ) : (
            <Button onClick={resetTest} variant="outline">
              Пройти еще раз
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
