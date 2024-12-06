"use server";

import { auth } from "@clerk/nextjs/server";
import { Video, Videos, YouTubeChannels, YouTubeChannelType } from "./db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db/drizzle";

export const getVideosForUser = async (): Promise<Video[]> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.select().from(Videos).where(eq(Videos.userId, userId));
};

export const getChannelsForUser = async (): Promise<YouTubeChannelType[]> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  return db
    .select()
    .from(YouTubeChannels)
    .where(eq(YouTubeChannels.userId, userId));
};
