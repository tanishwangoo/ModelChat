import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Input, Button, Avatar, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ChatUI.css';
// import { SendPrompt } from "../../ai-chat-backend/APIcall";
import axios from 'axios';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

// import { FetchHistory} from '../../backend/chatHstory';




const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [promptHistory, setpromptHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => { // fetching latest history is fine for HTTP reqs
        const fetchLastHist = async () => {
            try {
                const response = await axios.get('http://localhost:5000/history');
                if (response.data.length > 0) {
                    const fetchedHistory = response.data[0].history; // Get the history array
                    const newMessages = fetchedHistory.map((item) => ({
                        role: item.role,
                        content: item.content,
                    }));                   
                    return newMessages;
                }
            }
            catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };

        const changingmessages = async () => {
            const newMessages = await fetchLastHist();
            if (Array.isArray(newMessages)) {
                setMessages(newMessages); // Spread the newMessages into prevMessages
            }
        }

        changingmessages();


        socket.on('AIresponse', (AImessage) => {
            console.log(AImessage);
            setMessages((prevMessages) => [...prevMessages, AImessage]); // Add AI message to the state
        });
        return () => {
            socket.off('AIresponse');
        };
    }, []);

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            const userMessage = { role: 'user', content: [{ text: inputValue }] };
            setMessages((prevMessages) => [...prevMessages, userMessage]); 
            const newMessages = [...messages, userMessage];
            socket.emit('userMessage', newMessages);
            setInputValue('');
            // Get the response from the assistant

            // socket.on('AIresponse', (AImessage) => {
            //     console.log(AImessage);
            //     // Add the assistant's message to the messages array
            //     setMessages((prevMessages) => {
            //         const newMessages = [...prevMessages, AImessage];
            //         return newMessages; // Update the state with the new message
            //     });
            // });
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ color: 'white', textAlign: 'center', fontSize: '24px' }}>
                Chat with AI
            </Header>
            <Content style={{ padding: '20px' }}>
                <Row gutter={[16, 16]} style={{ height: 'calc(100vh - 112px)' }} justify="space-between">
                    <Col>
                        <h1>Database Entries</h1>
                        <div className='database-cont'>
                            <p>
                                Add MongoDB database entries here
                            </p>
                        </div>
                    </Col>
                    <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className="chat-window" style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                            {Array.isArray(messages) && messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <Card
                                        key={index}
                                        className={`chat-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
                                        bordered={false}
                                    >
                                        {message.content.map((item, idx) => (
                                            <p key={idx}>{item.text}</p>
                                        ))}
                                    </Card>
                                ))
                            ):(<></>)}
                        </div>
                        <div className="input-container" style={{ marginTop: '20px', display: 'flex' }}>
                            <Input
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                onPressEnter={handleSendMessage}
                            />
                            <Button type="primary" onClick={handleSendMessage} style={{ marginLeft: '10px' }}>
                                Send
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Chat Application ©2024</Footer>
        </Layout>
    );
}

export default ChatApp;
