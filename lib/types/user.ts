export type User = {
  id: string;
  name: string;
  email: string;
  level: "admin" | "user";
  created_at: string;
  updated_at: string;
};
