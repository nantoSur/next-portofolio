export type Skill = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSkillInput = {
  name: string;
  category: string;
};

export type UpdateSkillInput = CreateSkillInput & {
  id: string;
};
