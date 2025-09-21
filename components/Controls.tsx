import React, { useRef } from 'react';
import { StagingStyle, AspectRatio } from '../types';
import { STAGING_STYLES, ASPECT_RATIOS } from '../constants';

interface ControlsProps {
  onFilesChange: (files: FileList | null) => void;
  selectedStyle: StagingStyle;
  onStyleChange: (style: StagingStyle) => void;
  selectedAspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  imageCount: number;
  onStageAll: () => void;
  isStaging: boolean;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const MagicWandIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046a1 1 0 01-1.447.894l-.894-.447a1 1 0 01-.894-1.447l.447-.894A1 1 0 0111.3 1.046zM10 4a1 1 0 011 1v.046a1 1 0 01-1.447.894l-.894-.447a1 1 0 01-.894-1.447l.447-.894A1 1 0 0110 4zM8.7 1.046A1 1 0 019.146.152l.447.894a1 1 0 01-.894 1.447l-.894-.447A1 1 0 018.7 1.046zM15 6a1 1 0 011 1v.046a1 1 0 01-1.447.894l-.894-.447a1 1 0 01-.894-1.447l.447-.894A1 1 0 0115 6zM13.604 3.103a1 1 0 01.894-.447l.447.894a1 1 0 01-1.447 1.342l-.894-.447a1 1 0 01.103-1.342zM18 10a1 1 0 011 1v.046a1 1 0 01-1.447.894l-.894-.447a1 1 0 01-.894-1.447l.447-.894A1 1 0 0118 10zm-2.047 1.447a1 1 0 011.342-.103l.894.447a1 1 0 01-1.342 1.447l-.894-.447a1 1 0 01-.103-1.342zM4 10a1 1 0 011-1h.046a1 1 0 01.894 1.447l-.447.894a1 1 0 01-1.447.894V11a1 1 0 01-1-1zm2.897-1.447a1 1 0 011.342.103l.894-.447a1 1 0 111.342 1.447l-.894.447a1 1 0 01-1.447-1.342l-.103-.206zM7 15a1 1 0 011-1h.046a1 1 0 01.894 1.447l-.447.894a1 1 0 01-1.447.894V16a1 1 0 01-1-1zm-4.854-1.146a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM12.012 11.212a3 3 0 10-4.242 4.242 3 3 0 004.242-4.242z" clipRule="evenodd" />
    </svg>
);

const Controls: React.FC<ControlsProps> = ({
    onFilesChange,
    selectedStyle,
    onStyleChange,
    selectedAspectRatio,
    onAspectRatioChange,
    imageCount,
    onStageAll,
    isStaging
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Upload Your Photos</h2>
                <div 
                    onClick={handleFileSelect}
                    className="group border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => onFilesChange(e.target.files)}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-slate-600">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                        {imageCount > 0 && <p className="mt-4 text-sm font-medium text-green-700">{imageCount} image{imageCount > 1 ? 's' : ''} selected.</p>}
                    </div>
                </div>
            </div>
            
            <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Select a Style</h2>
                <div className="flex flex-wrap gap-2">
                    {STAGING_STYLES.map((style) => (
                        <button
                            key={style}
                            onClick={() => onStyleChange(style)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                selectedStyle === style
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">3. Select Aspect Ratio</h2>
                <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => onAspectRatioChange(ratio)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                selectedAspectRatio === ratio
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                            }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>
            
            {imageCount > 0 && (
                 <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Stage Your Images</h2>
                    <button
                        onClick={onStageAll}
                        disabled={isStaging}
                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        {isStaging ? (
                           <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Staging...</span>
                           </>
                        ) : (
                            <>
                                <MagicWandIcon className="w-5 h-5"/>
                                <span>Stage All Images</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Controls;
