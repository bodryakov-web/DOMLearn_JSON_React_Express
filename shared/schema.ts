import { z } from "zod";

export const TestQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  codeExample: z.string().optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(), // HTML content
  tests: z.array(TestQuestionSchema),
  tasks: z.array(TaskSchema),
  order: z.number(),
});

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  lessons: z.array(z.string()), // lesson IDs
  order: z.number(),
});

export const LevelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(z.string()), // section IDs
  order: z.number(),
  sectionTitles: z.record(z.string()).optional(), // карта id раздела -> название
});

export const LevelsStructureSchema = z.object({
  levels: z.array(LevelSchema),
});

export const AdminUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export type TestQuestion = z.infer<typeof TestQuestionSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type LevelsStructure = z.infer<typeof LevelsStructureSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
