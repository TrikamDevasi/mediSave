// MediSave Chat Service
import { mlApi } from "./api";

export const sendMessage = (message: string, sessionId?: string) =>
    mlApi.post("/chat", { message, sessionId });
