import React, { Component, createRef } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });

        // get form data
        this.postForm
            .validateFields()
            .then((form) => {
                // step1: get post info
                // step2: send post info to the server
                const { description, uploadPost } = form;
                console.log(uploadPost);
                const { type, originFileObj } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                // 给后段传数据
                if (postType) {
                    let formData = new FormData();
                    formData.append("message", description);
                    formData.append("media_file", originFileObj);

                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                message.success("The image/video is uploaded!");
                                this.postForm.resetFields();
                                this.handleCancel();
                                // home.js传进来的参数
                                this.props.onShowPost(postType);
                                this.setState({ confirmLoading: false });
                            }
                        })
                        .catch((err) => {
                            console.log("Upload image/video failed: ", err.message);
                            message.error("Failed to upload image/video!");
                            this.setState({ confirmLoading: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
            });
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Create"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;