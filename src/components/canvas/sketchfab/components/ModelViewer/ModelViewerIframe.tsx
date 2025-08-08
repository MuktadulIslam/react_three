import { SketchfabModel } from '../../types';

export default function ModelViewerIframe({ model }: { model: SketchfabModel }) {
    return (
        <div className="flex-1 relative">
            <iframe
                src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&dnt=1`}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
                title={model.name || 'Untitled Model'}
            />
        </div>
    );
}