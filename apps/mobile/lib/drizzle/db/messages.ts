import { drizzleDb } from '../adapter';
import { messages } from '../schema';
import { eq } from 'drizzle-orm';

export type Message = {
  id: string;
  projectId: string;
  createdAt: string;
  role: string;
  content: string;
  metadata: string | null;
};

export async function insertMessage(message: Message) {
  await drizzleDb.insert(messages).values({
    ...message,
    metadata: message.metadata ? JSON.stringify(message.metadata) : null,
  });
}

export async function insertMessages(msgs: Message[]) {
  for (const msg of msgs) {
    await insertMessage(msg);
  }
}

export async function getMessagesByProject(projectId: string): Promise<Message[]> {
  const rows = await drizzleDb.select().from(messages).where(eq(messages.projectId, projectId));
  return rows.map(row => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  }));
}

export async function clearMessages(projectId: string) {
  await drizzleDb.delete(messages).where(eq(messages.projectId, projectId));
}
