import { createInsertSchema } from "drizzle-zod";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const bots = pgTable(
  "bots",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar").notNull(),
    job: text("job").notNull(),
    instructions: text("instructions"),
    sandboxId: text("sandbox_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("bots_user_id_idx").on(t.userId)]
);

export const insertBotSchema = createInsertSchema(bots, {
  name: (s) => s.min(1, "Name is required"),
  job: (s) => s.min(1, "Job is required"),
  avatar: (s) => s.min(1),
}).omit({ id: true, userId: true, createdAt: true, sandboxId: true });
