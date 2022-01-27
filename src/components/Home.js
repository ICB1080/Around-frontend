import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";

const { TabPane } = Tabs;

function Home(props) {
    const [posts, setPost] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });

    const handleSearch = (option) => {
        const { type, keyword } = option;
        setSearchOption({ type: type, keyword: keyword });
    };

    useEffect(() => {
        // do search
        // first time -> didMount -> search option :{ type: all, keyword: ''}
        // after the first time -> didUpdate -> search option :{type: keyword/user/all, keyword: keyword}
        const { type, keyword } = searchOption;
        // do search
        fetchPost(searchOption);
    }, [searchOption]);

    const fetchPost = (option) => {
        // fetch post from the server
        // step1: api config
        // step2: send request
        // step3: response
        // case1: success
        // case2: failed
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            // 拿到后端给我的数据
            .then((res) => {
                if (res.status === 200) {
                    // 为了进行rerender
                    setPost(res.data);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };

    const renderPosts = (type) => {
        // case 1: no data
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        // case 2: filter image posts
        if (type === "image") {
            const imageArr = posts
                .filter((item) => item.type === "image")
                .map((image) => {
                    // react-grid-gallery需要这些格式
                    return {
                        src: image.url,
                        user: image.user,
                        caption: image.message,
                        thumbnail: image.url,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    };
                });

            return <PhotoGallery images={imageArr} />;
        }
        // case 3: filter video posts
        else if (type === "video") {
            return (
                <Row gutter={32}>
                    {posts
                        .filter((post) => post.type === "video")
                        .map((post) => (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls={true} className="video-block" />
                                <p>
                                    {post.user}: {post.message}
                                </p>
                            </Col>
                        ))}
                </Row>
            );

        }
    };

    const showPost = (type) => {
        console.log("type -> ", type);
        setActiveTab(type);

        setTimeout(() => {
            // 3秒后自动trigger界面
            setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
        }, 3000);
    };


    const operations = <CreatePostButton onShowPost={showPost} />;
    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch} />
            <div className="display">
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    {/*上传完图片post自动显示在image而不是需要刷新才看见*/}
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;