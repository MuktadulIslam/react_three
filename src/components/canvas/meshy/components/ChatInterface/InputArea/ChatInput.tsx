import React, { useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useMeshyChat } from '../../../context/MeshyChatContext';

interface ChatInputProps {
    onSendMessage: () => Promise<void>;
    placeholder?: string;
    maxHeight?: number;
    minHeight?: number
    maxLength?: number
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    placeholder = "Type your message here...",
    minHeight = 50,
    maxHeight = 200,
    maxLength = 600,
    disabled
}) => {

    const { currentInput, setCurrentInput } = useMeshyChat();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    };

    // Adjust height when message changes
    useEffect(() => {
        adjustHeight();
    }, [currentInput, maxHeight]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentInput(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!disabled) {
            setCurrentInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
            onSendMessage();
        }
    };


    return (
        <div className='w-full h-full relative'>
            <div className="px-2.5 pt-1.5 pb-2">
                <textarea
                    ref={textareaRef}
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className={`w-full resize-none border-none outline-none bg-transparent text-base leading-6 text-white placeholder-gray-400 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
                    style={{
                        minHeight: `${minHeight}px`,
                        maxHeight: `${maxHeight}px`
                    }}
                    disabled={disabled}
                    maxLength={maxLength}
                />
            </div>
            <div className="text-gray-400 h-3.5 absolute bottom-0.5 right-1 font-bold text-xs">
                {currentInput.length}
                <span className="px-0.5 inline-block">/</span>
                {maxLength}
            </div>
        </div>
    );
};

export default ChatInput;