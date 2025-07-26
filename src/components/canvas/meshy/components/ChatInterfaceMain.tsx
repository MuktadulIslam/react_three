// // src/components/canvas/meshy/components/ChatInterface.tsx
// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Image, Upload, Sparkles, RefreshCw, X, Trash2, ArrowLeftRight, Grid3X3, ChevronDown, Settings, Palette, Zap, Type, Camera, Brush } from 'lucide-react';
// import { useMeshyChat } from '../context/MeshyChatContext';
// import { useGet3DFromText, useGet3DFromImage, useRefineModel } from '../hooks/meshy-hooks';
// import { ActiveTab, MeshyTextTo3DRequest, MeshyImageTo3DRequest, MeshyRefineRequest, ArtStyles, Symmetry } from '../types';
// import ChatMessage from './ChatMessage';
// import ModelComparison from './ModelComparison';
// import ModelGallery from './ModelGallery';

// interface ChatInterfaceProps {
//     activeTab: ActiveTab;
//     setActiveTab: (tab: ActiveTab) => void;
//     onAddModelToSidebar?: (modelData: {
//         id: string;
//         name: string;
//         url: string;
//         fileType: 'glb';
//         model: any;
//     }) => void;
//     onTabChange?: (tab: ActiveTab) => void;
// }

// type MeshyModelVersion = 'meshy-4' | 'meshy-5';

// export default function ChatInterface({ activeTab, onAddModelToSidebar, setActiveTab, onTabChange }: ChatInterfaceProps) {
//     const {
//         messages,
//         addMessage,
//         updateMessage,
//         currentModel,
//         setCurrentModel,
//         currentInput,
//         setCurrentInput,
//         currentImage,
//         setCurrentImage,
//         isGenerating,
//         setIsGenerating,
//         startNewSession,
//         clearSession
//     } = useMeshyChat();

//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [showComparison, setShowComparison] = useState(false);
//     const [showGallery, setShowGallery] = useState(false);
//     const [selectedModel, setSelectedModel] = useState<MeshyModelVersion>('meshy-4');
//     const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyles>('realistic');
//     const [selectedSymmetry, setSelectedSymmetry] = useState<Symmetry>('auto');
//     const [showModelDropdown, setShowModelDropdown] = useState(false);
//     const [showArtStyleDropdown, setShowArtStyleDropdown] = useState(false);
//     const [showSymmetryDropdown, setShowSymmetryDropdown] = useState(false);
//     const [showGenerationTypeDropdown, setShowGenerationTypeDropdown] = useState(false);
//     const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const modelDropdownRef = useRef<HTMLDivElement>(null);
//     const artStyleDropdownRef = useRef<HTMLDivElement>(null);
//     const symmetryDropdownRef = useRef<HTMLDivElement>(null);
//     const generationTypeDropdownRef = useRef<HTMLDivElement>(null);

//     // Mutation hooks
//     const textTo3DMutation = useGet3DFromText();
//     const imageTo3DMutation = useGet3DFromImage();
//     const refineModelMutation = useRefineModel();

//     // Generation type options
//     const generationTypeOptions: { value: ActiveTab; label: string; description: string; icon: React.ReactNode }[] = [
//         {
//             value: 'text-to-3d',
//             label: 'Text to 3D',
//             description: 'Generate 3D models from text descriptions',
//             icon: <Type size={16} />
//         },
//         {
//             value: 'image-to-3d',
//             label: 'Image to 3D',
//             description: 'Convert images to 3D models',
//             icon: <Camera size={16} />
//         },
//         {
//             value: 'refine',
//             label: 'Refine Model',
//             description: 'Enhance existing 3D models',
//             icon: <Brush size={16} />
//         }
//     ];

//     // Model options
//     const modelOptions: { value: MeshyModelVersion; label: string; description: string }[] = [
//         { value: 'meshy-4', label: 'Meshy-4', description: 'Fast and efficient 3D generation' },
//         { value: 'meshy-5', label: 'Meshy-5', description: 'Latest model with improved quality' }
//     ];

//     // Art style options
//     const artStyleOptions: { value: ArtStyles; label: string; description: string; icon: string }[] = [
//         { value: 'realistic', label: 'Realistic', description: 'Photorealistic 3D models', icon: '📷' },
//         { value: 'sculpture', label: 'Sculpture', description: 'Artistic sculptural style', icon: '🗿' }
//     ];

//     // Symmetry options
//     const symmetryOptions: { value: Symmetry; label: string; description: string; icon: string }[] = [
//         { value: 'auto', label: 'Auto', description: 'Automatically detect symmetry', icon: '🤖' },
//         { value: 'on', label: 'On', description: 'Force symmetrical generation', icon: '⚖️' },
//         { value: 'off', label: 'Off', description: 'Allow asymmetrical generation', icon: '🎭' }
//     ];

//     // Auto-scroll to bottom when new messages arrive
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Initialize session when component mounts or tab changes
//     useEffect(() => {
//         if (messages.length === 0) {
//             startNewSession(activeTab);
//         }
//     }, [activeTab]);

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
//                 setShowModelDropdown(false);
//             }
//             if (artStyleDropdownRef.current && !artStyleDropdownRef.current.contains(event.target as Node)) {
//                 setShowArtStyleDropdown(false);
//             }
//             if (symmetryDropdownRef.current && !symmetryDropdownRef.current.contains(event.target as Node)) {
//                 setShowSymmetryDropdown(false);
//             }
//             if (generationTypeDropdownRef.current && !generationTypeDropdownRef.current.contains(event.target as Node)) {
//                 setShowGenerationTypeDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file && file.type.startsWith('image/')) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const result = e.target?.result as string;
//                 setCurrentImage(result);
//                 setImagePreview(result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const removeImage = () => {
//         setCurrentImage(null);
//         setImagePreview(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const handleGenerationTypeSelect = (type: ActiveTab) => {
//         onTabChange?.(type);
//         setShowGenerationTypeDropdown(false);
//     };

//     const handleModelSelect = (model: MeshyModelVersion) => {
//         setSelectedModel(model);
//         setShowModelDropdown(false);
//     };

//     const handleArtStyleSelect = (artStyle: ArtStyles) => {
//         setSelectedArtStyle(artStyle);
//         setShowArtStyleDropdown(false);
//     };

//     const handleSymmetrySelect = (symmetry: Symmetry) => {
//         setSelectedSymmetry(symmetry);
//         setShowSymmetryDropdown(false);
//     };

//     const handleSubmit = async () => {
//         if (!currentInput.trim() && !currentImage) return;
//         if (isGenerating) return;

//         const userMessageContent = activeTab === 'image-to-3d' && currentImage ?
//             `${currentInput.trim() || 'Generate 3D model from uploaded image'}` :
//             currentInput.trim();

//         // Add user message
//         const userMessageId = addMessage({
//             type: 'user',
//             content: userMessageContent,
//             generationType: activeTab,
//             imageUrl: currentImage || undefined
//         });

//         // Add assistant thinking message
//         const assistantMessageId = addMessage({
//             type: 'assistant',
//             content: `Generating your 3D model using ${selectedModel} (${selectedArtStyle}, ${selectedSymmetry})...`,
//             isGenerating: true
//         });

//         setIsGenerating(true);
//         setCurrentInput('');

//         try {
//             let result;

//             switch (activeTab) {
//                 case 'text-to-3d':
//                     const textRequest: MeshyTextTo3DRequest = {
//                         prompt: currentInput.trim(),
//                         art_style: selectedArtStyle,
//                         symmetry: selectedSymmetry,
//                         seed: Math.floor(Math.random() * 1000000),
//                         model_version: selectedModel
//                     };
//                     result = await textTo3DMutation.mutateAsync(textRequest);
//                     break;

//                 case 'image-to-3d':
//                     if (!currentImage) {
//                         throw new Error('Please upload an image first');
//                     }
//                     const imageRequest: MeshyImageTo3DRequest = {
//                         mode: 'preview',
//                         image_url: currentImage,
//                         prompt: currentInput.trim(),
//                         art_style: selectedArtStyle,
//                         model_version: selectedModel
//                     };
//                     result = await imageTo3DMutation.mutateAsync(imageRequest);
//                     break;

//                 case 'refine':
//                     if (!currentModel) {
//                         throw new Error('Please generate a model first before refining');
//                     }
//                     const refineRequest: MeshyRefineRequest = {
//                         texture_prompt: currentInput.trim(),
//                         texture_image_url: currentImage || undefined,
//                         mode: 'refine',
//                         model_version: selectedModel
//                     };
//                     result = await refineModelMutation.mutateAsync(refineRequest);
//                     break;

//                 default:
//                     throw new Error('Invalid generation type');
//             }

//             // Update current model
//             setCurrentModel(result);

//             // Update assistant message with success
//             updateMessage(assistantMessageId ?? '', {
//                 content: getSuccessMessage(activeTab, result, selectedModel),
//                 isGenerating: false,
//                 modelData: result
//             });

//         } catch (error) {
//             console.error('Generation error:', error);
//             updateMessage(assistantMessageId ?? '', {
//                 content: `Sorry, there was an error generating your 3D model: ${error instanceof Error ? error.message : 'Unknown error'}`,
//                 isGenerating: false,
//                 error: error instanceof Error ? error.message : 'Unknown error'
//             });
//         } finally {
//             setIsGenerating(false);
//             if (activeTab === 'image-to-3d') {
//                 removeImage();
//             }
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSubmit();
//         }
//     };

//     const getPlaceholder = () => {
//         switch (activeTab) {
//             case 'text-to-3d':
//                 return currentModel ?
//                     "Describe changes to your model or create something new..." :
//                     "Describe the 3D model you want to create...";
//             case 'image-to-3d':
//                 return "Describe what you want to generate from the image (optional)...";
//             case 'refine':
//                 return currentModel ?
//                     "Describe the textures or refinements you want..." :
//                     "Generate a model first, then describe refinements...";
//             default:
//                 return "Type your message...";
//         }
//     };

//     // Get all generated models from messages for comparison
//     const generatedModels = messages
//         .filter(msg => msg.modelData && msg.type === 'assistant')
//         .map(msg => msg.modelData!);

//     const selectedModelInfo = modelOptions.find(option => option.value === selectedModel);
//     const selectedArtStyleInfo = artStyleOptions.find(option => option.value === selectedArtStyle);
//     const selectedSymmetryInfo = symmetryOptions.find(option => option.value === selectedSymmetry);
//     const selectedGenerationTypeInfo = generationTypeOptions.find(option => option.value === activeTab);

//     return (
//         <div className="flex flex-col h-full bg-black/50 backdrop-blur-md ">
//             {/* Header */}
//             <div className="flex items-center justify-between p-2 border-b border-white/20">
//                 <div className="flex items-center gap-1">
//                     <span className="text-xl">✨</span>
//                     <span className="text-white font-medium text-lg">AI 3D Generation Chat</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-white">
//                     {generatedModels.length > 0 && (
//                         <button
//                             onClick={() => setShowGallery(true)}
//                             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                             title="View All Models"
//                         >
//                             <Grid3X3 size={20} />
//                         </button>
//                     )}
//                     {generatedModels.length > 1 && (
//                         <button
//                             onClick={() => setShowComparison(true)}
//                             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                             title="Compare Models"
//                         >
//                             <ArrowLeftRight size={20} />
//                         </button>
//                     )}
//                     <button
//                         onClick={() => startNewSession(activeTab)}
//                         className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                         title="New Conversation"
//                     >
//                         <RefreshCw size={20} />
//                     </button>
//                     <button
//                         onClick={clearSession}
//                         className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                         title="Delete Chat"
//                     >
//                         <Trash2 size={20} />
//                     </button>
//                 </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-2 space-y-2">
//                 {messages.map((message) => (
//                     <ChatMessage
//                         key={message.id}
//                         message={message}
//                         currentModel={currentModel}
//                         setCurrentModel={setCurrentModel}
//                         onAddToSidebar={onAddModelToSidebar}
//                     />
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area - Claude-like Design */}
//             <div className="w-full h-auto p-2 border-t border-white/10">
//                 {/* Image Preview (for image-to-3d) */}
//                 {imagePreview && activeTab === 'image-to-3d' && (
//                     <div className="py-1">
//                         <div className="relative inline-block">
//                             <img
//                                 src={imagePreview}
//                                 alt="Upload preview"
//                                 className="w-16 h-16 object-cover rounded-lg border border-white/20"
//                             />
//                             <button
//                                 onClick={removeImage}
//                                 className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
//                             >
//                                 <X size={10} />
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 <div className="w-full flex flex-col min-h-20 max-h-60 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
//                     <textarea
//                         value={currentInput}
//                         onChange={(e) => setCurrentInput(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder={getPlaceholder()}
//                         className="w-full flex-1 px-3 py-3 text-white placeholder-gray-400 focus:outline-none resize-none"
//                         disabled={isGenerating}
//                     />

//                     <div className="px-2 py-1.5 grow-0 flex items-center gap-2 text-xs text-gray-400 border-t border-white/10">
//                         <div className='space-x-2'>
//                             {/* Image Upload Button */}
//                             {(activeTab === 'image-to-3d' || activeTab === 'refine') && (
//                                 <button
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
//                                     title="Upload Image"
//                                 >
//                                     <Image size={20} />
//                                 </button>
//                             )}

//                             {/* Settings Toggle */}
//                             <button
//                                 onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
//                                 className={`p-2 rounded-lg transition-colors ${showAdvancedSettings
//                                     ? 'text-purple-300 bg-purple-500/20'
//                                     : 'text-gray-300 hover:text-white hover:bg-white/10'
//                                     }`}
//                                 title="Advanced Settings"
//                             >
//                                 <Settings size={20} />
//                             </button>
//                         </div>

//                         {showAdvancedSettings ? (
//                             <div className="flex-1 flex items-center gap-3 flex-wrap text-gray-200">
//                                 {/* Model Selection */}
//                                 <div className="relative" ref={modelDropdownRef}>
//                                     <button
//                                         onClick={() => setShowModelDropdown(!showModelDropdown)}
//                                         className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 text-sm"
//                                         title="Select Model Version"
//                                     >
//                                         <Sparkles size={16} color='#51a2ff' />
//                                         <span className="font-medium">{selectedModelInfo?.label}</span>
//                                         <ChevronDown size={14} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
//                                     </button>

//                                     {showModelDropdown && (
//                                         <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
//                                             <div className="p-2">
//                                                 {modelOptions.map((option) => (
//                                                     <button
//                                                         key={option.value}
//                                                         onClick={() => handleModelSelect(option.value)}
//                                                         className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedModel === option.value
//                                                             ? 'bg-purple-500/20 text-purple-200'
//                                                             : 'hover:bg-white/10 text-white'
//                                                             }`}
//                                                     >
//                                                         <div className="font-medium">{option.label}</div>
//                                                         <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Art Style Selection */}
//                                 <div className="relative" ref={artStyleDropdownRef}>
//                                     <button
//                                         onClick={() => setShowArtStyleDropdown(!showArtStyleDropdown)}
//                                         className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 text-sm"
//                                         title="Select Art Style"
//                                     >
//                                         <span>{selectedArtStyleInfo?.icon}</span>
//                                         <span className="font-medium">{selectedArtStyleInfo?.label}</span>
//                                         <ChevronDown size={14} className={`transition-transform ${showArtStyleDropdown ? 'rotate-180' : ''}`} />
//                                     </button>

//                                     {showArtStyleDropdown && (
//                                         <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
//                                             <div className="p-2">
//                                                 {artStyleOptions.map((option) => (
//                                                     <button
//                                                         key={option.value}
//                                                         onClick={() => handleArtStyleSelect(option.value)}
//                                                         className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${selectedArtStyle === option.value
//                                                             ? 'bg-purple-500/20 text-purple-200'
//                                                             : 'hover:bg-white/10 text-white'
//                                                             }`}
//                                                     >
//                                                         <span className="text-lg">{option.icon}</span>
//                                                         <div>
//                                                             <div className="font-medium">{option.label}</div>
//                                                             <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
//                                                         </div>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Symmetry Selection */}
//                                 <div className="relative" ref={symmetryDropdownRef}>
//                                     <button
//                                         onClick={() => setShowSymmetryDropdown(!showSymmetryDropdown)}
//                                         className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 text-sm"
//                                         title="Select Symmetry"
//                                     >
//                                         <span>{selectedSymmetryInfo?.icon}</span>
//                                         <span className="font-medium">{selectedSymmetryInfo?.label}</span>
//                                         <ChevronDown size={14} className={`transition-transform ${showSymmetryDropdown ? 'rotate-180' : ''}`} />
//                                     </button>

//                                     {showSymmetryDropdown && (
//                                         <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
//                                             <div className="p-2">
//                                                 {symmetryOptions.map((option) => (
//                                                     <button
//                                                         key={option.value}
//                                                         onClick={() => handleSymmetrySelect(option.value)}
//                                                         className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${selectedSymmetry === option.value
//                                                             ? 'bg-purple-500/20 text-purple-200'
//                                                             : 'hover:bg-white/10 text-white'
//                                                             }`}
//                                                     >
//                                                         <span className="text-lg">{option.icon}</span>
//                                                         <div>
//                                                             <div className="font-medium">{option.label}</div>
//                                                             <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
//                                                         </div>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="h-auto flex-1 flex items-center justify-start gap-2 text-sm pl-5">
//                                 <span className="flex items-center gap-1">
//                                     <Sparkles size={14} />
//                                     {selectedModelInfo?.label}
//                                 </span>
//                                 <span>•</span>
//                                 <span className="flex items-center gap-1">
//                                     <span>{selectedArtStyleInfo?.icon}</span>
//                                     {selectedArtStyleInfo?.label}
//                                 </span>
//                                 <span>•</span>
//                                 <span className="flex items-center gap-1">
//                                     <span>{selectedSymmetryInfo?.icon}</span>
//                                     {selectedSymmetryInfo?.label}
//                                 </span>
//                             </div>
//                         )}

//                         {/* Generation Type Selection */}
//                         <div className="relative" ref={generationTypeDropdownRef}>
//                             <button
//                                 onClick={() => setShowGenerationTypeDropdown(!showGenerationTypeDropdown)}
//                                 className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-400/30 text-sm text-blue-200"
//                                 title="Select Generation Type"
//                             >
//                                 {selectedGenerationTypeInfo?.icon}
//                                 <span className="font-medium">{selectedGenerationTypeInfo?.label}</span>
//                                 <ChevronDown size={14} className={`transition-transform ${showGenerationTypeDropdown ? 'rotate-180' : ''}`} />
//                             </button>

//                             {showGenerationTypeDropdown && (
//                                 <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
//                                     <div className="p-2">
//                                         {generationTypeOptions.map((option) => (
//                                             <button
//                                                 key={option.value}
//                                                 onClick={() => setActiveTab(option.value)}
//                                                 className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${activeTab === option.value
//                                                     ? 'bg-blue-500/20 text-blue-200'
//                                                     : 'hover:bg-white/10 text-white'
//                                                     }`}
//                                             >
//                                                 {option.icon}
//                                                 <div>
//                                                     <div className="font-medium">{option.label}</div>
//                                                     <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
//                                                 </div>
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Send Button */}
//                         <button
//                             onClick={handleSubmit}
//                             disabled={(!currentInput.trim() && !currentImage) || isGenerating}
//                             className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
//                             title="Send Message"
//                         >
//                             {isGenerating ? (
//                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                             ) : (
//                                 <Send size={20} />
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Hidden File Input */}
//                 <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                 />
//             </div>

//             {/* Model Comparison Modal */}
//             {showComparison && generatedModels.length > 1 && (
//                 <ModelComparison
//                     models={generatedModels}
//                     onClose={() => setShowComparison(false)}
//                 />
//             )}

//             {/* Model Gallery Modal */}
//             {showGallery && (
//                 <ModelGallery
//                     models={generatedModels}
//                     onClose={() => setShowGallery(false)}
//                     onSelectModel={(model) => {
//                         if (model.model_urls?.glb) {
//                             setCurrentModel(model);
//                         }
//                         setShowGallery(false);
//                     }}
//                     onCompare={(models) => {
//                         setShowGallery(false);
//                         setShowComparison(true);
//                     }}
//                 />
//             )}
//         </div >
//     );
// }

// function getSuccessMessage(type: ActiveTab, result: any, modelVersion: MeshyModelVersion): string {
//     const modelName = modelVersion === 'meshy-4' ? 'Meshy-4' : 'Meshy-5';

//     switch (type) {
//         case 'text-to-3d':
//             return `🎉 Your 3D model has been generated using ${modelName}! You can view it above, refine it further, or create something new.`;
//         case 'image-to-3d':
//             return `📸 Successfully converted your image to a 3D model using ${modelName}! Feel free to refine it or upload another image.`;
//         case 'refine':
//             return `✨ Your model has been refined with new textures using ${modelName}! The enhanced version is ready for preview.`;
//         default:
//             return `✅ Generation complete using ${modelName}!`;
//     }
// }