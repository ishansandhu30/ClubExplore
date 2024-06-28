import React, { useEffect, useState } from "react";
import "./style.css";
import {
  Form,
  Input,
  Upload,
  Select,
  Button,
  message,
  Dropdown,
  Modal,
  notification,
} from "antd";
import profilePicture from "../../../Assets/images/Profile Pic.png";
import {
  UploadOutlined,
  UsergroupAddOutlined,
  MailOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";
import "../../../Components/Modal/modal.css";
import { getAllCategories } from "../../../API/Category";
import { createClub } from "../../../API/Clubs";
import { useNavigate } from "react-router-dom";

const CreateClub = () => {
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clubForm] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [currentClub, setCurrentClub] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onFinish = (values) => {
    if (currentClub?.banner) {
      setCurrentClub({
        ...currentClub,
        title: values.title,
        description: values.description,
        category: values.category,
      });

      showModal();
    } else {
      notification.error({
        message: "Invalid Banner",
        description: "Kindly upload the banner for the club",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUpload = (info) => {
    if (info.file.status !== "uploading") {
      console.log("info", info);
      console.log("info.file:", info.file);
      console.log("info.fileList", info.fileList);
      message.success(`${info.file.name} file uploaded successfully`);

      setCurrentClub({ ...currentClub, banner: info?.file });
      clubForm.setFieldValue("banner", info?.file);
    }
  };

  const showModal = () => {
    setIsModalVisible2(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const onFinishVerifyAccess = async (values) => {
    console.log("Received values:", values);

    try {
      setLoading(true);

      const formData = new FormData();

      if (currentClub?.banner) {
        formData.append("title", currentClub?.title);
        formData.append("description", currentClub?.description);
        formData.append("category", currentClub?.category);
        formData.append("banner", currentClub?.banner);

        const response = await createClub(formData, values?.verification_code);

        if (Math.floor(response.status / 100) === 2) {
          message.success("Club created successfully");
          setLoading(false);
          setCurrentClub({});
          setIsModalVisible2(false);
          clubForm.resetFields();
        } else {
          message.error("Failed to create club");
          setLoading(false);
          setCurrentClub({});
        }
      } else {
        notification.error({
          message: "Invalid Banner",
          description: "Kindly upload the banner for the club",
        });
      }
    } catch (error) {
      console.error("Error creating club:", error);
      setLoading(false);
      setCurrentClub({});
    }

    setIsModalVisible2(false);
    navigate("/home");
  };

  return (
    <div className="create-club">
      <div className="page-title-wrapper">
        <span className="page-title">Create New Club</span>
      </div>

      <div className="create-form">
        <Form
          name="clubForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={clubForm}
        >
          <div className="page-title-wrapper">
            <span className="title">Club Information</span>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </div>

          <Form.Item
            label="Club Name"
            name="title"
            rules={[{ required: true, message: "Please input the club name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Club Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the club description!",
              },
            ]}
          >
            <Input.TextArea rows={8} />
          </Form.Item>
          <div className="form-footer">
            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please select the club category!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Categories"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={categories}
              />
            </Form.Item>

            <Form.Item
              label="Club Banner"
              name="banner"
              valuePropName="fileList"
              getValueFromEvent={handleUpload}
            >
              <Upload
                name="banner"
                beforeUpload={() => false}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Banner</Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </div>

      <Modal
        title="Verify Access"
        visible={isModalVisible2}
        onCancel={handleCancel2}
        footer={null}
        centered
      >
        <Form
          name="verifyAccess"
          onFinish={onFinishVerifyAccess}
          layout="vertical"
        >
          <div className="wrap-mini-modal">
            <Form.Item
              label="Verification Code"
              name="verification_code"
              rules={[
                {
                  required: true,
                  message: "Please input valid verification code",
                },
              ]}
            >
              <Input type="password" placeholder="Code" />
            </Form.Item>{" "}
          </div>
          <div>
            <Form.Item>
              <Button
                loading={loading}
                icon={<VerifiedOutlined />}
                type="primary"
                htmlType="submit"
              >
                Verify
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateClub;
