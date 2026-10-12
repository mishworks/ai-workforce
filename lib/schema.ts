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
