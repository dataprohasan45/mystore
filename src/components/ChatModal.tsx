import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserAccount, Language, ChatAttachment } from '../types';
import {
  X,
  Send,
  Image,
  Video,
  FileText,
  Paperclip,
  CheckCheck,
  User,
  Shield,
  Download,
  Play,
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  lang: Language;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  isAdminView?: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  currentUser,
  lang,
  onClose,
  messages,
  onSendMessage,
  isAdminView = false,
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | 'pdf' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle uploading Image, Video, or PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    let type: 'image' | 'video' | 'pdf' = 'image';
    if (file.type.includes('video')) {
      type = 'video';
    } else if (file.type.includes('pdf') || fileName.endsWith('.pdf')) {
      type = 'pdf';
    } else {
      type = 'image';
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachment({
          type,
          url: reader.result,
          fileName,
          fileSize,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    onSendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: isAdminView ? 'customer-01' : 'admin',
      text: inputText.trim(),
      attachment: attachment || undefined,
      timestamp: timeStr,
      dateStr: dateStr,
      isRead: false,
    });

    setInputText('');
    setAttachment(null);
  };

  // Quick preset sample PDF / Video attachments for instant testing
  const addSampleAttachment = (type: 'image' | 'video' | 'pdf') => {
    if (type === 'pdf') {
      setAttachment({
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Product_Brochure_Kiraton_Hub.pdf',
        fileSize: '1.2 MB',
      });
    } else if (type === 'video') {
      setAttachment({
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-shopping-in-a-trendy-clothing-store-42352-large.mp4',
        fileName: 'Product_Demo_Video_15s.mp4',
        fileSize: '4.5 MB',
      });
    } else {
      setAttachment({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        fileName: 'Product_Clear_Photo.jpg',
        fileSize: '1.4 MB',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[88vh] flex flex-col shadow-2xl border-2 border-red-500/20 overflow-hidden text-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-green-800 to-green-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              {isAdminView ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5 text-yellow-300" />}
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {isAdminView
                  ? isBn
                    ? 'গ্রাহক সহায়তা ইনবক্স (অ্যাডমিন ভিউ)'
                    : 'Customer Chat Inbox (Admin View)'
                  : isBn
                  ? 'সরাসরি অ্যাডমিন সাপোর্ট চ্যাট'
                  : 'Live Admin Support Chat'}
              </h3>
              <p className="text-[11px] text-green-200">
                {isBn ? 'ছবি, টেক্সট, ভিডিও ও পিডিএফ ফাইল আদান-প্রদান' : 'Exchange Photos, Videos, Text & PDF files'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-gray-500 font-semibold px-1">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`rounded-2xl p-3 sm:p-4 max-w-[85%] sm:max-w-md shadow-sm break-words ${
                    isMe
                      ? 'bg-green-700 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {/* Text body */}
                  {msg.text && <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>}

                  {/* Attachment Previews (Image, Video, PDF) */}
                  {msg.attachment && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      {msg.attachment.type === 'image' && (
                        <div className="rounded-xl overflow-hidden border border-black/10">
                          <img
                            src={msg.attachment.url}
                            alt={msg.attachment.fileName}
                            className="max-h-52 w-full object-cover"
                          />
                          <div className="p-1.5 bg-black/40 text-[10px] text-white flex justify-between items-center">
                            <span className="truncate">{msg.attachment.fileName}</span>
                            <span>{msg.attachment.fileSize}</span>
                          </div>
                        </div>
                      )}

                      {msg.attachment.type === 'video' && (
                        <div className="rounded-xl overflow-hidden bg-black border border-black/10">
                          <video
                            src={msg.attachment.url}
                            controls
                            className="max-h-52 w-full object-contain"
                          />
                          <div className="p-1.5 bg-black/60 text-[10px] text-white flex justify-between items-center">
                            <span className="truncate">🎬 {msg.attachment.fileName}</span>
                            <span>{msg.attachment.fileSize}</span>
                          </div>
                        </div>
                      )}

                      {msg.attachment.type === 'pdf' && (
                        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/10 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                              PDF
                            </div>
                            <div className="truncate text-left">
                              <span className="font-bold truncate block">{msg.attachment.fileName}</span>
                              <span className="text-[10px] opacity-75">{msg.attachment.fileSize}</span>
                            </div>
                          </div>
                          <a
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors shrink-0"
                            title="Download/Open PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 mt-0.5 px-1 flex items-center gap-1">
                  <span>{msg.dateStr}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-green-600" />}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Attachment Preview Bar */}
        {attachment && (
          <div className="p-3 bg-green-50 border-t border-green-200 flex items-center justify-between text-xs text-green-950 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-green-700 text-white px-2 py-0.5 rounded text-[10px]">
                {attachment.type.toUpperCase()}
              </span>
              <span className="truncate font-semibold max-w-xs">{attachment.fileName}</span>
              <span className="text-gray-500">({attachment.fileSize})</span>
            </div>
            <button
              onClick={() => setAttachment(null)}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar & Attachment Tools */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0 space-y-2">
          {/* Quick Attachment Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold">{isBn ? 'ফাইল জুড়ুন:' : 'Attach:'}</span>
            <label className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-600 flex items-center gap-1 cursor-pointer font-medium">
              <Image className="w-4 h-4" />
              <span>ছবি</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="p-1.5 rounded-lg hover:bg-gray-100 text-red-600 flex items-center gap-1 cursor-pointer font-medium">
              <Video className="w-4 h-4" />
              <span>ভিডিও</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="p-1.5 rounded-lg hover:bg-gray-100 text-amber-600 flex items-center gap-1 cursor-pointer font-medium">
              <FileText className="w-4 h-4" />
              <span>পিডিএফ</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <span className="text-gray-300">|</span>

            {/* Quick Demo Preload Buttons */}
            <button
              type="button"
              onClick={() => addSampleAttachment('pdf')}
              className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              + ডেমো PDF
            </button>
            <button
              type="button"
              onClick={() => addSampleAttachment('video')}
              className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              + ডেমো ভিডিও
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isBn
                  ? 'আপনার প্রশ্ন বা বার্তা লিখুন (ছবি, ভিডিও, পিডিএফ পাঠাতে পারেন)...'
                  : 'Type message, share photos, videos, or PDFs...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold p-2.5 sm:px-5 sm:py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? 'পাঠান (OK)' : 'Send (OK)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
