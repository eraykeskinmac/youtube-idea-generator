"use client";

import { Video, VideoComments } from "@/server/db/schema";
import { formatDistanceToNow } from "date-fns";
import { ThumbUp, MessageCircle, Eye, Clock } from "tabler-icons-react";
import Image from "next/image";
import { formatCount } from "@/lib/utils";
import {
  Paper,
  Group,
  Stack,
  Title,
  Text,
  Avatar,
  Box,
  ScrollArea,
} from "@mantine/core";

interface Props {
  video: Video;
  comments: (typeof VideoComments.$inferSelect)[];
}

export default function VideoDetail({ video, comments }: Props) {
  return (
    <Stack gap="xl"  p={'60'}>
      <Paper shadow="xs" radius="xl" p="xl" withBorder>
        <Group align="items-center">
          <Box w="50%" p="md">
            <Stack gap="lg">
              <Title order={1} c="red" lineClamp={2}>
                {video.title}
              </Title>
              <Text fw={600} c="dimmed">
                {video.channelTitle}
              </Text>
              <Group gap="xl">
                <Group gap={4}>
                  <Eye size={16} strokeWidth={3} />
                  <Text size="sm" fw={600} c="dimmed">
                    {formatCount(video.viewCount ?? 0)} views
                  </Text>
                </Group>
                <Group gap={4}>
                  <ThumbUp size={16} strokeWidth={3} />
                  <Text size="sm" fw={600} c="dimmed">
                    {formatCount(video.likeCount ?? 0)} likes
                  </Text>
                </Group>
                <Group gap={4}>
                  <MessageCircle size={16} strokeWidth={3} />
                  <Text size="sm" fw={600} c="dimmed">
                    {formatCount(video.commentCount ?? 0)} comments
                  </Text>
                </Group>
                <Group gap={4}>
                  <Clock size={16} strokeWidth={3} />
                  <Text size="sm" fw={600} c="dimmed">
                    {formatDistanceToNow(new Date(video.publishedAt))} ago
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Box>
          <Box style={{ overflow: "hidden", borderRadius: "8px" }}>
            <Image
              src={video.thumbnailUrl ?? ""}
              alt={video.title}
              width={550}
              height={270}
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Group>
      </Paper>

      <Paper shadow="xs" radius="xl" p="xl" withBorder>
        <Stack gap="md">
          <Title order={2} c="red">
            Description
          </Title>
          <ScrollArea.Autosize mah={500}>
            <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
              {video.description}
            </Text>
          </ScrollArea.Autosize>
        </Stack>
      </Paper>

      <Paper shadow="xs" radius="xl" p="xl" withBorder>
        <Stack gap="xl">
          <Title order={2} c="red">
            Comments
          </Title>
          {comments.length === 0 ? (
            <Text size="sm" c="dimmed">
              No comments yet.
            </Text>
          ) : (
            <Stack gap="xl">
              {comments
                .sort(
                  (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
                )
                .map((comment) => (
                  <Box key={comment.id}>
                    <Group align="flex-start" gap="md">
                      <Avatar radius="xl" color="red">
                        {comment.commentText.charAt(0).toUpperCase()}
                      </Avatar>
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Text fw={500} c="red">
                            Anonymous
                          </Text>
                          <Text size="sm" c="dimmed">
                            {formatDistanceToNow(new Date(comment.publishedAt))}{" "}
                            ago
                          </Text>
                        </Group>
                        <Text size="sm">{comment.commentText}</Text>
                        <Group gap="xs">
                          <ThumbUp size={16} />
                          <Text size="sm" c="dimmed">
                            {comment.likeCount}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                  </Box>
                ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
