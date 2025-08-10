import React, { useState, useRef, useEffect } from 'react';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const messagesEndRef = useRef(null);

  // Sample documents (replace with your actual documents)
  const documents = [
    { id: '1', name: 'Company Policy 2023' },
    { id: '2', name: 'Employee Handbook' },
    { id: '3', name: 'Technical Documentation' },
    { id: '4', name: 'Project Requirements' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation - in a real app, you'd verify credentials with a backend
    if (username && password) {
      setIsLoggedIn(true);
      setMessages([
        {
          role: 'assistant',
          content: 'Welcome! Please select a document to chat about.',
        },
      ]);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessages([]);
    setSelectedDocument('');
  };

  const handleDocumentSelect = (e) => {
    const docId = e.target.value;
    setSelectedDocument(docId);

    // Find the selected document
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setMessages([
        {
          role: 'assistant',
          content: `You've selected "${doc.name}". What would you like to know about this document?`,
        },
      ]);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !selectedDocument) return;

    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the selected document for context
      const doc = documents.find((d) => d.id === selectedDocument);

      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: `Regarding "${
          doc?.name || 'the selected document'
        }", here's a simulated response to: "${inputValue}". In a real app, this would analyze the document content.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Document Chatbot Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Document Chat Assistant</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm">Welcome, {username}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto h-[calc(100vh-60px)]">
        {/* Document selection */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <label htmlFor="document-select" className="font-medium">
              Select Document:
            </label>
            <select
              id="document-select"
              value={selectedDocument}
              onChange={handleDocumentSelect}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a document --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-6 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="font-bold mb-1">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-6 flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-200 text-gray-800">
                <div className="font-bold mb-1">Assistant</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleChatSubmit}
          className="p-4 border-t border-gray-200 bg-white"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                selectedDocument
                  ? 'Ask about the selected document...'
                  : 'Please select a document first'
              }
              disabled={isLoading || !selectedDocument}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !selectedDocument}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
