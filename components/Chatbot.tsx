"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'שלום! איך אני יכול לעזור לך היום?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    if (message.includes('שלום') || message.includes('היי') || message.includes('hello')) {
      return 'שלום! ברוכים הבאים לחנות שלנו. איך אני יכול לעזור לך?';
    }
    if (message.includes('מוצרים') || message.includes('products')) {
      return 'יש לנו מגוון רחב של מוצרים! תוכל לראות אותם בדף המוצרים. האם תרצה עזרה במציאת מוצר ספציפי?';
    }
    if (message.includes('מחיר') || message.includes('price') || message.includes('עלות')) {
      return 'המחירים מוצגים ליד כל מוצר. אם יש לך שאלות על מחירים ספציפיים, אשמח לעזור!';
    }
    if (message.includes('משלוח') || message.includes('shipping') || message.includes('delivery')) {
      return 'אנו מציעים משלוח מהיר לכל הארץ. זמן המשלוח הוא 2-3 ימי עסקים.';
    }
    if (message.includes('תשלום') || message.includes('payment') || message.includes('כרטיס')) {
      return 'אנו מקבלים תשלום בכרטיסי אשראי, PayPal, ובמזומן בעת המשלוח.';
    }
    if (message.includes('חזרה') || message.includes('return') || message.includes('החלפה')) {
      return 'יש לך 30 ימים להחזיר מוצרים במצב חדש. לפרטים נוספים, צור קשר עם שירות הלקוחות.';
    }
    if (message.includes('עזרה') || message.includes('help')) {
      return 'אני כאן כדי לעזור! תוכל לשאול על מוצרים, מחירים, משלוח, תשלום או כל דבר אחר.';
    }
    
    return 'תודה על השאלה! אם תרצה עזרה נוספת, תוכל לשאול על מוצרים, מחירים, משלוח או תשלום.';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        💬
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4">
          <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">צ'אט עם החנות</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('he-IL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="הקלד הודעה..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 