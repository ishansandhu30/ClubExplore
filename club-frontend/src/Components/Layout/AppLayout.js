import { Layout } from "antd";
import Sidebar from "../Sidebar";
import "./style.css"

const { Content } = Layout;

const AppLayout = ({ setToken, setUser, children }) => {


  return (
    <div>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sidebar setToken={setToken} setUser={setUser} />
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppLayout;
