"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Video } from "@/server/db/schema";
import { formatDistanceToNow } from "date-fns";
import { IconLoader2, IconDeviceTv } from "@tabler/icons-react";
import {
  Image,
  Button,
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Center,
} from "@mantine/core";
import { formatCount } from "@/lib/utils";
import { notifications } from "@mantine/notifications";
import { scrapeVideos } from "@/server/youtube-action";

export default function VideoList({
  initialVideos,
}: {
  initialVideos: Video[];
}) {
  const [isScraping, setIsScraping] = useState(false);
  const [videos, setVideos] = useState(initialVideos);

  console.log("videos", videos);

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const newVideos = await scrapeVideos();
      setVideos((prevVideos) => [...newVideos, ...prevVideos]);
      notifications.show({
        title: "Scrape Successful",
        message: `Scraped ${newVideos.length} new videos`,
        autoClose: 4000,
      });
    } catch (error) {
      console.error("Error scraping videos:", error);
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        if (error.message.includes("No channels found for the user")) {
          errorMessage =
            "Please add YouTube channels first by clicking settings in the top right.";
        } else {
          errorMessage = error.message;
        }
      }

      console.log("errorMessage", errorMessage);
      notifications.show({
        color: "red",
        title: "Scrape Failed",
        message: errorMessage,
        variant: "danger",
        autoClose: 4000,
      });
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  if (videos.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Center
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <IconDeviceTv size={44} color="#EF4444" stroke={1.5} />
          </Center>
          <Title order={3}>No videos yet</Title>
          <Text c="dimmed" ta="center" maw={400}>
            Please add YouTube channels and then scrape for videos. Video
            comments will be analyzed for content ideas.
          </Text>
          <Button
            onClick={handleScrape}
            disabled={isScraping}
            color="red"
            size="md"
            radius="md"
            leftSection={isScraping && <IconLoader2 className="animate-spin" />}
          >
            {isScraping ? "Scraping..." : "Scrape Videos"}
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Videos</Title>
        <Button
          onClick={handleScrape}
          disabled={isScraping}
          color="red"
          size="md"
          radius="md"
          leftSection={isScraping && <IconLoader2 className="animate-spin" />}
        >
          {isScraping ? "Scraping..." : "Scrape"}
        </Button>
      </Group>

      <Grid>
        {videos.map((video) => (
          <Grid.Col key={video.id} span={4}>
            <Link
              href={`/video/${video.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card padding="md" radius="md" withBorder>
                {/* {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Center bg="gray.1" h="100%">
                      <Text c="dimmed">No thumbnail</Text>
                    </Center>
                  )} */}
                <Card.Section>
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      style={{ objectFit: "cover" }}
                      height={160}
                      alt={video.title}
                    />
                  ) : (
                    <Center bg="gray.1" h="100%">
                      <Text c="dimmed">No thumbnail</Text>
                    </Center>
                  )}
                </Card.Section>
                <Stack mt="md" gap="xs">
                  <Text lineClamp={2} fw={600}>
                    {video.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {video.channelTitle}
                  </Text>
                  <Group gap="xs" c="dimmed" style={{ fontSize: "12px" }}>
                    <Text>
                      {video.viewCount ? formatCount(video.viewCount) : "0"}{" "}
                      views
                    </Text>
                    <Text>•</Text>
                    <Text>
                      {formatDistanceToNow(new Date(video.publishedAt))} ago
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
