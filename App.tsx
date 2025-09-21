import React, { useState, useCallback } from 'react';
import { StagingStyle, StagedImageFile, AspectRatio, RoomType } from './types';
import { STAGING_STYLES, ASPECT_RATIOS, ROOM_TYPES } from './constants';
import { stageImage } from './services/geminiService';
import Header from './components/Header';
import Controls from './components/Controls';

const Loader: React.FC = () => (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-sm font-medium">Staging in progress...</p>
        <p className="mt-1 text-xs">This may take a moment.</p>
    </div>
);

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


interface ImageCardProps {
    item: StagedImageFile;
    onStage: (id: string) => void;
    onRemove: (id: string) => void;
    onRoomTypeChange: (id: string, roomType: RoomType) => void;
    onFeedbackChange: (id: string, feedback: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ item, onStage, onRemove, onRoomTypeChange, onFeedbackChange }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 text-center">Original</h3>
                <img src={item.previewUrl} alt="Original empty room" className="w-full h-64 object-cover rounded-md" />
            </div>
            <div className="p-4 relative">
                <h3 className="font-semibold text-slate-700 mb-2 text-center">Staged</h3>
                 <div className="w-full h-64 bg-slate-100 rounded-md flex items-center justify-center relative">
                    {item.isLoading && <Loader />}
                    {item.stagedUrl ? (
                        <img src={item.stagedUrl} alt="Staged room" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <div className="text-center text-slate-500 text-sm">
                            {item.error ? (
                                <p className="text-red-500 px-2">{item.error}</p>
                            ) : (
                                <p>Select a room type and click "Stage Image"</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        {item.stagedUrl && !item.isLoading && (
            <div className="p-4 bg-slate-100/70 border-t border-slate-200">
                <label htmlFor={`feedback-${item.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                    Provide Feedback to Refine (Optional)
                </label>
                <input
                    id={`feedback-${item.id}`}
                    type="text"
                    value={item.feedbackText}
                    onChange={(e) => onFeedbackChange(item.id, e.target.value)}
                    placeholder="e.g., 'Use a smaller sofa', 'add more plants'"
                    className="w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    aria-label="Feedback for refinement"
                />
            </div>
        )}
        <div className="p-4 bg-slate-50 flex justify-between items-center gap-4">
             <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Remove image"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
            <div className="flex-grow min-w-0">
                <label htmlFor={`room-type-${item.id}`} className="sr-only">Room Type</label>
                <select
                    id={`room-type-${item.id}`}
                    value={item.roomType}
                    onChange={(e) => onRoomTypeChange(item.id, e.target.value as RoomType)}
                    className="w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    aria-label="Select Room Type"
                >
                    {ROOM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {item.stagedUrl && !item.isLoading && (
                     <a
                        href={item.stagedUrl}
                        download={`staged-${item.file.name.replace(/\.[^/.]+$/, "")}.png`}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition-colors shadow-sm"
                        aria-label="Download staged image"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span>Download</span>
                    </a>
                )}
                <button
                    onClick={() => onStage(item.id)}
                    disabled={item.isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    {item.isLoading ? 'Staging...' : (item.stagedUrl ? 'Refine Image' : 'Stage Image')}
                </button>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
    const [stagedFiles, setStagedFiles] = useState<StagedImageFile[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<StagingStyle>(STAGING_STYLES[0]);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
    
    const [configError] = useState<string | null>(() => {
        if (!process.env.API_KEY) return "Gemini API Key (API_KEY) is not configured.";
        return null;
    });

    const handleFilesChange = useCallback((files: FileList | null) => {
        if (!files) return;

        const newFiles: StagedImageFile[] = Array.from(files).map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
            stagedUrl: null,
            isLoading: false,
            error: null,
            roomType: 'Other',
            feedbackText: '',
        }));
        
        setStagedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }, []);

    const handleRoomTypeChange = useCallback((id: string, roomType: RoomType) => {
        setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, roomType } : f));
    }, []);

    const handleFeedbackChange = useCallback((id: string, feedback: string) => {
        setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, feedbackText: feedback } : f));
    }, []);

    const handleStageImage = useCallback(async (id: string) => {
        const fileToStage = stagedFiles.find(f => f.id === id);
        if (!fileToStage) return;

        setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, isLoading: true, error: null } : f));

        try {
            const resultUrl = await stageImage(fileToStage.file, selectedStyle, selectedAspectRatio, fileToStage.roomType, fileToStage.feedbackText);
            setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, stagedUrl: resultUrl, isLoading: false } : f));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, isLoading: false, error: errorMessage } : f));
        }
    }, [stagedFiles, selectedStyle, selectedAspectRatio]);

    const handleStageAll = useCallback(() => {
        stagedFiles.forEach(file => {
            if (!file.stagedUrl && !file.isLoading) {
                handleStageImage(file.id);
            }
        });
    }, [stagedFiles, handleStageImage]);

    const handleRemoveImage = useCallback((id: string) => {
        setStagedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.previewUrl);
            }
            return prev.filter(f => f.id !== id);
        });
    }, []);
    
    const isAnyImageLoading = stagedFiles.some(f => f.isLoading);
    
    if (configError) {
         return (
             <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                 <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                     <h2 className="text-2xl font-bold text-red-700 mb-4">Configuration Error</h2>
                     <p className="text-slate-600">{configError}</p>
                     <p className="mt-4 text-sm text-slate-500">Please make sure the required environment variables are set in your project's configuration.</p>
                 </div>
             </div>
         );
    }
    
    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Controls
                    onFilesChange={handleFilesChange}
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                    selectedAspectRatio={selectedAspectRatio}
                    onAspectRatioChange={setSelectedAspectRatio}
                    imageCount={stagedFiles.length}
                    onStageAll={handleStageAll}
                    isStaging={isAnyImageLoading}
                />

                <div className="mt-12">
                    {stagedFiles.length > 0 ? (
                        <div className="space-y-8">
                            {stagedFiles.map((item) => (
                                <ImageCard 
                                    key={item.id}
                                    item={item}
                                    onStage={handleStageImage}
                                    onRemove={handleRemoveImage}
                                    onRoomTypeChange={handleRoomTypeChange}
                                    onFeedbackChange={handleFeedbackChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-slate-700">Welcome to AI Virtual Staging Pro</h2>
                            <p className="mt-2 text-slate-500">Upload one or more photos of empty rooms to get started.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default App;
