import React, { useState, useRef, useEffect } from 'react';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  // Documents state
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Company Policy.pdf', pages: 120, uploadDate: '2023-05-15' },
    { id: '2', name: 'Employee Handbook.pdf', pages: 85, uploadDate: '2023-06-20' },
  ]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [editDocument, setEditDocument] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // UI state
  const [activeTab, setActiveTab] = useState('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple admin validation
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setMessages([{ role: 'assistant', content: 'Welcome Admin! Manage your documents or chat with me.' }]);
    } else {
      alert('Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setMessages([]);
    setSelectedDocument('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    // Simulate page count extraction (in real app, use a PDF library)
    const simulatedPageCount = Math.floor(Math.random() * 600) + 1;
    setPageCount(simulatedPageCount);
    
    if (simulatedPageCount > 500) {
      alert('Document exceeds 500 page limit');
      return;
    }

    setNewDocument(file);
    setFileName(file.name);
  };

  const handleUploadDocument = () => {
    if (!newDocument || !fileName) return;

    // Create new document entry
    const newDoc = {
      id: Date.now().toString(),
      name: fileName,
      pages: pageCount,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setDocuments([...documents, newDoc]);
    setShowUploadModal(false);
    setNewDocument(null);
    setFileName('');
    setPageCount(0);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      if (selectedDocument === id) {
        setSelectedDocument('');
      }
    }
  };

  const handleUpdateDocument = () => {
    if (!editDocument || !fileName) return;

    setDocuments(documents.map(doc => 
      doc.id === editDocument.id ? { ...doc, name: fileName } : doc
    ));
    setEditDocument(null);
    setFileName('');
  };

  const handleDocumentSelect = (id) => {
    setSelectedDocument(id);
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setMessages([{ 
        role: 'assistant', 
        content: `You've selected "${doc.name}". What would you like to know about this document?` 
      }]);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !selectedDocument) return;

    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the selected document
      const doc = documents.find(d => d.id === selectedDocument);
      
      // Add assistant response
      const assistantMessage = { 
        role: 'assistant', 
        content: `Regarding "${doc?.name || 'the selected document'}", here's a simulated response to: "${inputValue}". In a real app, this would analyze the document content.`
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Navigation</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full text-left px-3 py-2 rounded ${activeTab === 'documents' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                Document Management
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full text-left px-3 py-2 rounded ${activeTab === 'chat' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                Document Chat
              </button>
            </nav>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'documents' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Document Management</h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Upload New Document
                </button>
              </div>

              {/* Documents table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.pages}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditDocument(doc);
                              setFileName(doc.name);
                              setShowUploadModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Document selection for chat */}
              <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Select Document:</label>
                  <select
                    value={selectedDocument}
                    onChange={(e) => handleDocumentSelect(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select a document --</option>
                    {documents.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat interface */}
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="mb-6 flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-gray-200 text-gray-800">
                      <div className="font-bold mb-1">Assistant</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat input */}
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={selectedDocument ? "Ask about the selected document..." : "Please select a document first"}
                    disabled={isLoading || !selectedDocument}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isLoading || !selectedDocument}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Edit Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {editDocument ? 'Edit Document' : 'Upload New Document'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document name"
                />
              </div>
              
              {!editDocument && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF File (max 500 pages)
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {pageCount > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Detected pages: {pageCount} {pageCount > 500 && '(Exceeds limit!)'}
                    </p>
                  )}
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditDocument(null);
                    setFileName('');
                    setPageCount(0);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editDocument ? handleUpdateDocument : handleUploadDocument}
                  disabled={!fileName || (pageCount > 500 && !editDocument)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editDocument ? 'Update Document' : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;