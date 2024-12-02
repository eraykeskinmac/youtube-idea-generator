import { Button, Container, Group, Text } from "@mantine/core";
import classes from "../components/Welcome.module.css";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Transform Your{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "red", to: "pink" }}
            inherit
          >
            Youtube
          </Text>{" "}
          Content Strategy
        </h1>

        <Text className={classes.description} color="dimmed">
          Generate fresh, engaging ideas for your Youtube channel in seconds.
          Never run out of content again
        </Text>

        <Group className={classes.controls}>
          <Button
            component={Link}
            size="xl"
            className={classes.control}
            variant="gradient"
            href="/videos"
            gradient={{ from: "red", to: "pink" }}
          >
            Get started Free
          </Button>

          <Text>No credit card required</Text>
        </Group>
      </Container>
    </div>
  );
}
