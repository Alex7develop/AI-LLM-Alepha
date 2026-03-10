export interface Chat {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  /** Источник создания: "web" | "telegram" и т.д. */
  create_source?: string;
  dialog_type?: string;
}

/** Ответ GET /ai/chats/{userId} */
export interface ChatsApiResponse {
  chats: Array<{
    dialog_id: string;
    dialog_type: string;
    created_at: string;
    create_source: string;
  }>;
}
