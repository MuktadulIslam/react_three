import { useState, useCallback } from "react"
import SketchfabSearchSideBar from '../sketchfab/SketchfabSearchSideBar';
import SidebarHeader from "./SidebarHeader"
import SidebarGroupedObjects from "./SidebarGroupedObjects"
import { DraggableObjectGroup, DraggableObjectData } from './types'
import Dynamic3DModel from "./Dynamic3DModel"
import { SketchfabModel } from "../sketchfab/types"
import { sidebarStaticObjectGroups } from "./utils"

interface UploadedFile {
    id: string;
    name: string;
    url: string;
    fileType: 'glb' | 'fbx';
    uploadDate: Date;
    source?: 'upload' | 'sketchfab';
    sketchfabModel?: SketchfabModel;
}

export default function Sidebar(
    { visible, onDragStart }:
        { visible: boolean, onDragStart: (component: React.ReactNode) => void }
) {
    const [showSketchfabSearch, setShowSketchfabSearch] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleFileUpload = useCallback((file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() as 'glb' | 'fbx';
        const fileUrl = URL.createObjectURL(file);

        const uploadedFile: UploadedFile = {
            id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            url: fileUrl,
            fileType: fileExtension,
            uploadDate: new Date(),
            source: 'upload'
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
    }, []);

    const handleSketchfabModelAdd = useCallback((modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: SketchfabModel;
    }) => {
        const sketchfabFile: UploadedFile = {
            id: modelData.id,
            name: modelData.name,
            url: modelData.url,
            fileType: modelData.fileType,
            uploadDate: new Date(),
            source: 'sketchfab',
            sketchfabModel: modelData.model
        };

        setUploadedFiles(prev => [...prev, sketchfabFile]);
        console.log('Successfully added Sketchfab model to sidebar:', modelData.name);
    }, []);

    // Convert uploaded files to draggable objects
    const uploadedObjects: DraggableObjectData[] = uploadedFiles.map(file => ({
        id: file.id,
        component: <Dynamic3DModel url={file.url} fileType={file.fileType} />,
        name: file.name,
        icon: file.source === 'sketchfab' ? '🌐' : (file.fileType === 'glb' ? '📦' : '🗃️'),
        description: file.source === 'sketchfab'
            ? `From Sketchfab • ${file.fileType.toUpperCase()}`
            : `Uploaded ${file.fileType.toUpperCase()} model`
    }));

    // Separate uploaded and Sketchfab models
    const regularUploadedObjects = uploadedObjects.filter(obj => {
        const file = uploadedFiles.find(f => f.id === obj.id);
        return file?.source === 'upload';
    });

    const sketchfabObjects = uploadedObjects.filter(obj => {
        const file = uploadedFiles.find(f => f.id === obj.id);
        return file?.source === 'sketchfab';
    });

    // Get existing Sketchfab model UIDs to prevent duplicates
    const existingSketchfabUids = uploadedFiles
        .filter(file => file.source === 'sketchfab' && file.sketchfabModel)
        .map(file => file.sketchfabModel!.uid);

    const objectGroups: DraggableObjectGroup[] = [
        // Add Sketchfab models group if there are any
        ...(sketchfabObjects.length > 0 ? [{
            id: 'sketchfab-models',
            name: 'Sketchfab Models',
            icon: '🌐',
            color: 'from-purple-500 to-indigo-500',
            objects: sketchfabObjects
        }] : []),

        // Add uploaded files group if there are any uploaded files
        ...(regularUploadedObjects.length > 0 ? [{
            id: 'uploaded',
            name: 'Uploaded Models',
            icon: '☁️',
            color: 'from-emerald-500 to-teal-500',
            objects: regularUploadedObjects
        }] : []),

        ...sidebarStaticObjectGroups
    ];

    return (
        <div>
            <SketchfabSearchSideBar
                show={showSketchfabSearch}
                setShow={setShowSketchfabSearch}
                onAddModelToSidebar={handleSketchfabModelAdd}
                existingModelUids={existingSketchfabUids}
            />


            <div className={`absolute left-0 top-0 h-full w-80 ${visible ? '' : '-translate-x-80'} transition-all duration-200 bg-gray-900/90 backdrop-blur-md text-white flex flex-col z-40 shadow-2xl border-r border-gray-700/50 overflow-hidden`}>
                <SidebarHeader
                    setShowSketchfabSearch={setShowSketchfabSearch}
                    onFileUpload={handleFileUpload}
                />

                <SidebarGroupedObjects
                    objectGroups={objectGroups}
                    onDragStart={onDragStart}
                />

                {/* Footer */}
                <div className="p-2 border-t border-gray-700/30 bg-gradient-to-r from-gray-900 to-gray-800">
                    <div className="w-full text-center text-xs text-gray-400">🔧 Ctrl+Shift+Z to toggle controls</div>
                    {uploadedFiles.length > 0 && (
                        <div className="w-full text-center text-xs text-gray-500 mt-1">
                            📦 {uploadedFiles.length} model{uploadedFiles.length !== 1 ? 's' : ''} loaded
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}