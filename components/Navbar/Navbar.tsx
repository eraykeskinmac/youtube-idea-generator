"use client";

import { Burger, Container, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
// import { SettingsModal } from "./SettingsModal";
import classes from "./Navbar.module.css";
import { SettingsModal } from "../SettingsModal";

const links = [
  { link: "/videos", label: "Video" },
  { link: "/ideas", label: "Ideas" },
];

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={pathname === link.link}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Group>
            <Text size="xl" fw={700}>
              YoutubeTab
            </Text>
            <Text size="xl">✨</Text>
          </Group>
        </Link>

        {isSignedIn ? (
          <Group gap="md">
            <Group gap={5} visibleFrom="xs">
              {items}
            </Group>
            <SettingsModal />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="xs"
              size="sm"
            />
          </Group>
        ) : (
          <Link
            href="/videos"
            className={classes.link}
            style={{
              backgroundColor: "var(--mantine-color-red-filled)",
              color: "var(--mantine-color-white)",
              fontWeight: 600,
            }}
          >
            Get Started Now
          </Link>
        )}
      </Container>
    </header>
  );
}
