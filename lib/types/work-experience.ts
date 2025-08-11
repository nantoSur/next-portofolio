//lib/types/work-experience

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  logoUrl?: string; // ✅ camelCase
  startDate: string;
  endDate?: string;
  summary?: string[];
  achievements?: string[];
  skills: {
    id: string;
    name: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperienceForm extends Partial<WorkExperience> {
  summary: string[];
  achievements?: string[];
  skillIds: string[]; // ✅ relasi many-to-many dengan skills
}
