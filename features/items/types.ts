export type ItemType = "lost" | "found";
export type ItemStatus = "open" | "claimed" | "returned";

export type Item = {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string | null;
  imageUrl: string | null;
  reporterId: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
};
