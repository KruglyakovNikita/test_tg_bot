import { Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";

/**
 * Генерирует видео из изображения.
 * Пока что заглушка — возвращает фиктивный URL.
 * В будущем здесь разместится вызов реального API.
 */
export async function generateImageToVideo(
  apiKey: string,
  ctx: Context
): Promise<string> {
  const photoMsg = ctx.text as Message.PhotoMessage | undefined;
  if (!photoMsg || !photoMsg.photo.length) {
    throw new Error("NO_PHOTO");
  }
  const photo = photoMsg.photo[photoMsg.photo.length - 1];
  // TODO: download with ctx.telegram.getFileLink/photo.file_id etc.
  return "https://example.com/video.mp4";
}

/**
 * Генерирует видео из текста.
 * Пока что заглушка — возвращает фиктивный URL.
 */
export async function generateTextToVideo(
  apiKey: string,
  text: string
): Promise<string> {
  // TODO: вызвать callYourAiApiForText(apiKey, text)
  const videoUrl = "https://example.com/video-from-text.mp4";
  return videoUrl;
}
