import React from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import Layout from "../components/Layout";
import { Header, Button, Icon, Label } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Header as="h2" style={{ paddingTop: "40px" }}>
          Sorry - an error occurred!
        </Header>
        <Button
          style={{ backgroundColor: "royalblue", color: "white" }}
          icon
          size="large"
          onClick={() => router.push("/")}
        >
          {"Home    "}
          <Icon name="home" />
        </Button>
        <p style={{ padding: "40px" }}>Try again or just enjoy this video!</p>
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          // playing={true}
          // muted={true}
          controls={true}
        />
      </div>
    </Layout>
  );
};

export default ErrorPage;
