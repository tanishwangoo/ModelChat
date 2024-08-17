import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Input, Button, Avatar, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ChatUI.css';
import { SendPrompt } from "./APIcall";
// import { FetchHistory} from '../../backend/chatHstory';

import axios from 'axios';


const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [promptHistory, setpromptHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchLastHist = async()=>{
            try{
                const response = await axios.get('http://localhost:5000/history');
                if (response.data.length > 0) {
                    const fetchedHistory = response.data[0].history; // Get the history array
                    const newMessages = fetchedHistory.map((item) => ({
                        role: item.role,
                        content: item.content,
                      }));
                  
                      // Set the messages state once with the new messages
                      return newMessages;
                      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
                  }
            }
            catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };

        const changingmessages = async()=>{
            const newMessages = await fetchLastHist();
            setMessages(newMessages);   
        }
        
        changingmessages();
    }, []);

    const handleSendMessage = async () => {

        if (inputValue.trim() !== '') {
            const userMessage = { role: 'user', content: [{ text: inputValue }] };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            const newPromptHistory = [...messages, userMessage];// for sending to backend
            setInputValue('');

            // Get the response from the assistant
            const outputText = await SendPrompt(newPromptHistory);
            const assistantMessage = { role: 'assistant', content: [{ text: outputText }] };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            const updatedPromptHistory = [...newPromptHistory, assistantMessage];

            // Save the full conversation to the database

            try {
                // Send history to backend to save
                await axios.post('http://localhost:5000/api/saveHistory', updatedPromptHistory);
                console.log('History saved successfully');
            }
            catch (error) {
                console.error('Error saving history:', error);
            }
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
                            {messages.map((message, index) => (
                                <Card
                                    key={index}
                                    className={`chat-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
                                    bordered={false}
                                >
                                    {message.content.map((item, idx) => (
                                        <p key={idx}>{item.text}</p>
                                    ))}
                                </Card>
                            ))}
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
