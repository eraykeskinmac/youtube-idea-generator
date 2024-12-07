"use client";

import { useState, useEffect } from "react";
import { Modal, Button, TextInput, ScrollArea, Paper, Card, Group } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";

import { YouTubeChannelType } from "@/server/db/schema";
import { addChannelForUser, removeChannelForUser } from "@/server/mutations";
import { getChannelsForUser } from "@/server/queries";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannelType[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const fetchedChannels = await getChannelsForUser();
      setChannels(fetchedChannels);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addChannel = async () => {
    if (newChannel) {
      setIsLoading(true);
      try {
        const addedChannel = await addChannelForUser(newChannel);
        setChannels([...channels, addedChannel]);
        setNewChannel("");
      } catch (error) {
        console.error("Failed to add channel:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeChannel = async (id: string) => {
    setIsLoading(true);
    try {
      await removeChannelForUser(id);
      setChannels(channels.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to remove channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        color="red"
        variant="subtle"
        size="xs"
      >
        Settings
      </Button>
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        radius="md"
        padding="md"
        title="Settings"
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <h3
              style={{
                fontWeight: 600,
                color: "var(--mantine-color-red-6)",
                fontSize: "1.125rem",
                marginBottom: "0.5rem",
              }}
            >
              Add New Channel
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextInput
                placeholder="Channel name"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                onClick={addChannel}
                disabled={isLoading}
                color="red"
                leftSection={<IconPlus size={16} />}
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <h3
              style={{
                fontWeight: 600,
                color: "var(--mantine-color-red-6)",
                fontSize: "1.125rem",
                marginBottom: "0.5rem",
              }}
            >
              Saved Channels
            </h3>
            {isLoading ? (
              <div
                style={{
                  height: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Loading...
              </div>
            ) : (
              <ScrollArea h={150}>
                {channels.map((channel) => (
                  <Card
                    key={channel.id}
                    p="sm"
                    mb="xs"
                  >
                    <Group justify="space-between">
                    <span>{channel.name}</span>
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => removeChannel(channel.id)}
                      disabled={isLoading}
                    >
                      <IconX size={16} />
                    </Button>
                    </Group>
                  </Card>
                ))}
              </ScrollArea>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
