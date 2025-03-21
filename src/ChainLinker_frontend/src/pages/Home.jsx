import React from "react";
import { Layout, Button, Typography, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ShortenForm from "../components/ShortenForm";
import LinkList from "../components/LinkList";
import { useAuthClient } from "../hooks/useAuthClient";

const { Header, Content } = Layout;
const { Title } = Typography;

const truncate = (string) => {
  return string.length > 10
    ? `${string.slice(0, 6)}...${string.slice(-4)}`
    : string;
};
const Home = () => {
  const { isAuthenticated, principal, login, logout } = useAuthClient();
  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          width: "100%",
          padding: "0 160px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ color: "#fff", margin: 0 }}>
          ChainLinker
        </Title>
        {isAuthenticated ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button icon={<UserOutlined />} size="large">
              {truncate(principal?.toString())}
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" size="large" onClick={login}>
            Login
          </Button>
        )}
      </Header>
      <Content style={{ width: "100%", padding: "40px 160px" }}>
        <ShortenForm />
        {isAuthenticated ? <LinkList /> : null}
      </Content>
    </Layout>
  );
};

export default Home;
