import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  Lesson, 
  Section, 
  Level, 
  LevelsStructure, 
  LevelsStructureSchema,
  LessonSchema,
  AdminUser 
} from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

export interface IStorage {
  // Levels and structure
  getLevelsStructure(): Promise<LevelsStructure>;
  updateLevelsStructure(structure: LevelsStructure): Promise<void>;
  
  // Lessons
  getLesson(levelId: string, sectionId: string, lessonId: string): Promise<Lesson | null>;
  saveLesson(levelId: string, sectionId: string, lessonId: string, lesson: Lesson): Promise<void>;
  createLesson(levelId: string, sectionId: string, lesson: Lesson): Promise<void>;
  
  // Authentication
  validateAdmin(username: string, password: string): Promise<boolean>;
}

export class FileStorage implements IStorage {
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async getLevelsStructure(): Promise<LevelsStructure> {
    try {
      const filePath = path.join(DATA_DIR, 'levels.json');
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      return LevelsStructureSchema.parse(data);
    } catch (error) {
      // Return default structure if file doesn't exist
      const defaultStructure: LevelsStructure = {
        levels: [
          {
            id: 'level1',
            title: 'Уровень 1: Основы',
            description: 'Изучение основ JavaScript',
            sections: ['section1', 'section2'],
            order: 1
          },
          {
            id: 'level2',
            title: 'Уровень 2: Структуры данных',
            description: 'Массивы, объекты и структуры данных',
            sections: ['section1', 'section2'],
            order: 2
          },
          {
            id: 'level3',
            title: 'Уровень 3: Функции',
            description: 'Функции, замыкания и области видимости',
            sections: ['section1', 'section2'],
            order: 3
          },
          {
            id: 'level4',
            title: 'Уровень 4: Продвинутые темы',
            description: 'Асинхронность, модули и современный JavaScript',
            sections: ['section1', 'section2'],
            order: 4
          }
        ]
      };
      
      await this.updateLevelsStructure(defaultStructure);
      return defaultStructure;
    }
  }

  async updateLevelsStructure(structure: LevelsStructure): Promise<void> {
    await this.ensureDirectoryExists(DATA_DIR);
    const filePath = path.join(DATA_DIR, 'levels.json');
    await fs.writeFile(filePath, JSON.stringify(structure, null, 2));
  }

  async getLesson(levelId: string, sectionId: string, lessonId: string): Promise<Lesson | null> {
    try {
      const filePath = path.join(DATA_DIR, levelId, sectionId, lessonId, `${lessonId}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      return LessonSchema.parse(data);
    } catch {
      return null;
    }
  }

  async saveLesson(levelId: string, sectionId: string, lessonId: string, lesson: Lesson): Promise<void> {
    const dirPath = path.join(DATA_DIR, levelId, sectionId, lessonId);
    await this.ensureDirectoryExists(dirPath);
    const filePath = path.join(dirPath, `${lessonId}.json`);
    await fs.writeFile(filePath, JSON.stringify(lesson, null, 2));
  }

  async createLesson(levelId: string, sectionId: string, lesson: Lesson): Promise<void> {
    await this.saveLesson(levelId, sectionId, lesson.id, lesson);
  }

  async validateAdmin(username: string, password: string): Promise<boolean> {
    return username === 'bodryakov.web' && password === 'Anna-140275';
  }
}

export const storage = new FileStorage();
