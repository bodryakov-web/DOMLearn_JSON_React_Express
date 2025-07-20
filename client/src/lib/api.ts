import { LevelsStructure, Lesson } from "@shared/schema";

const API_BASE = "/api";

export const api = {
  // Levels
  async getLevelsStructure(): Promise<LevelsStructure> {
    const response = await fetch(`${API_BASE}/levels`);
    if (!response.ok) throw new Error("Failed to fetch levels structure");
    return response.json();
  },

  async updateLevelsStructure(structure: LevelsStructure): Promise<void> {
    const response = await fetch(`${API_BASE}/levels`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(structure),
    });
    if (!response.ok) throw new Error("Failed to update levels structure");
  },

  async updateLevel(levelId: string, data: { title: string }): Promise<void> {
    const response = await fetch(`${API_BASE}/levels/${levelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update level");
  },

  // Lessons
  async getLesson(levelId: string, sectionId: string, lessonId: string): Promise<Lesson> {
    const response = await fetch(`${API_BASE}/lessons/${levelId}/${sectionId}/${lessonId}`);
    if (!response.ok) throw new Error("Failed to fetch lesson");
    return response.json();
  },

  async saveLesson(levelId: string, sectionId: string, lessonId: string, lesson: Lesson): Promise<void> {
    const response = await fetch(`${API_BASE}/lessons/${levelId}/${sectionId}/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lesson),
    });
    if (!response.ok) throw new Error("Failed to save lesson");
  },

  async createLesson(levelId: string, sectionId: string, lesson: Lesson): Promise<void> {
    const response = await fetch(`${API_BASE}/lessons/${levelId}/${sectionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lesson),
    });
    if (!response.ok) throw new Error("Failed to create lesson");
  },

  // Admin
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string }> {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },
};
