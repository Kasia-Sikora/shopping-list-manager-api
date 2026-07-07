export type List = {
  id: string;
  title: string;
  content: unknown[];
  ownerId: string | null;
  createdAt: string;
  updatedAt?: string;
};
