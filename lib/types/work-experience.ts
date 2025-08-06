import type { Skill } from "./skill";

export type WorkExperience = {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  logoUrl?: string | null;
  startDate: string; // format: YYYY-MM-DD
  endDate?: string | null;
  summary: string[];
  achievements: string[];
  skills: Skill[]; // relasi
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkExperienceInput = {
  role: string;
  company: string;
  location?: string;
  logoUrl?: string;
  startDate: string;
  endDate?: string;
  summary: string[];
  achievements: string[];
  skillIds: string[]; // array of selected skill.id
};

export type UpdateWorkExperienceInput = CreateWorkExperienceInput & {
  id: string;
};
