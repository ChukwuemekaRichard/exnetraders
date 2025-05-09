// components/NewsletterModal.js
import { useState } from "react";

export default function NewsletterModal({ isOpen, onClose, onSend }) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await onSend({ subject, content });
    setIsSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-violet-700 mb-4">
            Send Newsletter
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-violet-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-violet-500"
                required
                placeholder="Enter your newsletter content here. Use simple formatting:
  
  - Start with a greeting
  - Add sections with clear headings
  - Use bullet points for key information
  - Include any links as full URLs
  
  Example:
  
  Dear Investors,
  
  Market Update:
  - Tech stocks rose 5% last quarter
  - New opportunities in renewable energy
  
  Upcoming Events:
  - Webinar July 15: Tax Strategies
  "
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 bg-amber-200 text-black rounded-md hover:bg-amber-500 transition disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
