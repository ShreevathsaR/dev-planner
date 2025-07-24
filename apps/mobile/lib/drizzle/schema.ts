import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  content: text('content').notNull(),
  role: text('role').notNull(), 
  createdAt: text('created_at').notNull(),
  metadata: text('metadata'), 
});
