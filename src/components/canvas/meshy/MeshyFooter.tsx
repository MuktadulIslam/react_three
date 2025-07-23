import { Bot } from 'lucide-react';
import { ActiveTab } from './types';

export default function MeshyFooter({ activeTab }: { activeTab: ActiveTab }) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-gray-400/60 via-stone-400/60 to-stone-600/70 px-4 py-1">
            <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                <Bot size={20} className="text-purple-700" />
                Pro Tips
            </h4>
            <div className="space-y-0 text-sm text-gray-200">
                {activeTab === 'text-to-3d' && (
                    <>
                        <p>• Be specific with materials, colors, and style</p>
                        <p>• Use "realistic" for detailed models</p>
                        <p>• Try "low-poly" for game-ready assets</p>
                    </>
                )}
                {activeTab === 'image-to-3d' && (
                    <>
                        <p>• Use clear, well-lit reference images</p>
                        <p>• Objects with simple backgrounds work best</p>
                        <p>• Multiple angles improve quality</p>
                    </>
                )}
                {activeTab === 'refine-model' && (
                    <>
                        <p>• Click "Refine" for higher quality versions</p>
                        <p>• Models can be downloaded in multiple formats</p>
                        <p>• Add to sidebar to use in your scene</p>
                    </>
                )}
            </div>
        </div>
    );
}