export type ProgramLevel = "beginner" | "intermediate" | "skills" | "adult";

export type Program = {
  id: string;
  name: string;
  level: ProgramLevel | null;
  description: string | null;
  created_at: string | null;
};
