"use client";

import { useState, useEffect, useRef } from "react";
import { Idea } from "@/server/db/schema";
import {
  IconExternalLink,
  IconArrowUpRight,
  IconMessageCircle,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  getIdeaDetails,
  kickoffIdeaGeneration,
  processPendingJobs,
  checkForUnprocessedJobs,
  getNewIdeas,
} from "@/server/idea-action";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Modal,
  Badge,
  Paper,
  Group,
  Title,
  Text,
  Container,
  Stack,
  Tooltip,
  Grid,
  ScrollArea,
  Box,
  Anchor,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import YoutubeLogo from "@/public/youtube-logo.png";

interface Props {
  initialIdeas: Idea[];
}

export interface IdeaDetails {
  videoTitle: string;
  commentText: string;
}

export default function IdeaList({ initialIdeas }: Props) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideaDetails, setIdeaDetails] = useState<Record<string, IdeaDetails>>(
    {}
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const prevHasUnprocessedJobs = useRef<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await kickoffIdeaGeneration();
      notifications.show({
        title: "Generating ideas...",
        message:
          "We are processing your comments to generate new ideas. This may take a few moments.",
        color: "blue",
      });
    } catch (error) {
      console.error("Error initiating idea generation:", error);
      notifications.show({
        title: "Error",
        message: "Failed to initiate idea generation. Please try again.",
        color: "red",
      });
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const pollJobsInterval = setInterval(async () => {
      try {
        await processPendingJobs();
        const hasUnprocessedJobs = await checkForUnprocessedJobs();
        console.log("Has unprocessed jobs:", hasUnprocessedJobs);

        if (prevHasUnprocessedJobs.current && !hasUnprocessedJobs) {
          notifications.show({
            title: "Idea generation completed!",
            message: "Your new ideas are ready.",
            color: "green",
          });

          const newIdeas = await getNewIdeas();
          setIdeas(newIdeas);
        }

        setIsGenerating(hasUnprocessedJobs);
        prevHasUnprocessedJobs.current = hasUnprocessedJobs;
      } catch (error) {
        console.error("Error processing pending jobs:", error);
      }
    }, 5000);

    return () => clearInterval(pollJobsInterval);
  }, []);

  useEffect(() => {
    const fetchDetailsForIdeas = async () => {
      for (const idea of ideas) {
        if (!ideaDetails[idea.id]) {
          const details = await getIdeaDetails(idea.videoId, idea.commentId);
          setIdeaDetails((prev) => ({
            ...prev,
            [idea.id]: details,
          }));
        }
      }
    };

    fetchDetailsForIdeas();
  }, [ideas]);

  if (ideas.length === 0) {
    return (
      <Container size="md">
        <Stack align="center" gap="lg" py="xl">
          <Box
            style={(theme) => ({
              backgroundColor: theme.colors.blue[0],
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
            })}
          >
            <IconSparkles size={44} stroke={1.5} color="blue" />
          </Box>
          <Title order={3}>No ideas yet</Title>
          <Text maw={400}>
            Get started by generating ideas from your video comments. Each idea
            is crafted based on your content.
          </Text>
          <Button
            size="lg"
            color="red"
            loading={isGenerating}
            onClick={handleGenerate}
            leftSection={!isGenerating && <IconSparkles size={20} />}
          >
            {isGenerating ? "Generating..." : "Generate Ideas"}
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group p="apart" mb="xl">
        <Title order={1}>Ideas</Title>
        <Button
          color='red'
          loading={isGenerating}
          onClick={handleGenerate}
          leftSection={!isGenerating && <IconSparkles size={20} />}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </Group>

      <Grid>
        {ideas.map((idea) => (
          <Grid.Col key={idea.id} span={4}>
            <Paper
              p="md"
              radius="md"
              withBorder
              style={(theme) => ({
                cursor: "pointer",
                transition: "transform 200ms ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              })}
              onClick={() => {
                setSelectedIdea(idea);
                open();
              }}
            >
              <Group p="apart">
                <Text lineClamp={2} w={500} size="lg">
                  {idea.videoTitle}
                </Text>
                <Tooltip label="View source video">
                  <Anchor
                    component={Link}
                    href={`/video/${idea.videoId}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconArrowUpRight size={16} />
                  </Anchor>
                </Tooltip>
              </Group>
              <Badge color="blue" mt="xs">
                Score: {idea.score}
              </Badge>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        radius="md"
        title={
          <Group p="apart">
            <Text size="xl" w={700}>
              {selectedIdea?.videoTitle}
            </Text>
            <Badge color="blue" size="lg">
              Score: {selectedIdea?.score}
            </Badge>
          </Group>
        }
      >
        {selectedIdea && (
          <Stack gap="md">
            <Box>
              <Text w={500} color="blue" mb="xs">
                Description
              </Text>
              <ScrollArea h={100}>
                <Text size="sm">{selectedIdea.description}</Text>
              </ScrollArea>
            </Box>

            <Box>
              <Text w={500} color="blue" mb="xs">
                Research Links
              </Text>
              <Grid>
                {selectedIdea.research.map((url) => (
                  <Grid.Col key={url} span={3}>
                    <Anchor
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Paper p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <IconExternalLink size={16} />
                          <Text size="sm" truncate>
                            {new URL(url).hostname.replace("www.", "")}
                          </Text>
                        </Group>
                      </Paper>
                    </Anchor>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>

            <Box>
              <Text w={500} mb="xs">
                Video Title
              </Text>
              <Anchor
                component={Link}
                href={`/video/${selectedIdea.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Paper p="xs" radius="md" withBorder>
                  <Group gap="xs">
                    <Image
                      src={YoutubeLogo}
                      alt="Youtube Logo"
                      width={16}
                      height={16}
                    />
                    <Text size="sm" truncate>
                      {ideaDetails[selectedIdea.id]?.videoTitle || "Loading..."}
                    </Text>
                  </Group>
                </Paper>
              </Anchor>
            </Box>

            <Box>
              <Text w={500} mb="xs">
                Video Comment
              </Text>
              <Paper p="md" radius="md" withBorder>
                <Group gap="xs" align="flex-start">
                  <IconMessageCircle size={20} color="blue" />
                  <ScrollArea h={60}>
                    <Text size="sm">
                      {ideaDetails[selectedIdea.id]?.commentText ||
                        "Loading..."}
                    </Text>
                  </ScrollArea>
                </Group>
              </Paper>
            </Box>

            <Flex justify="flex-end">
              <Anchor
                component={Link}
                href={`/video/${selectedIdea.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={(theme) => ({
                  "&:hover": {
                    color: theme.colors.blue[6],
                  },
                })}
              >
                <Group gap={4}>
                  <Text size="sm">View source video</Text>
                  <IconArrowUpRight size={16} />
                </Group>
              </Anchor>
            </Flex>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
