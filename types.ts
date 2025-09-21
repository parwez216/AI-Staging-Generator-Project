import { STAGING_STYLES, ASPECT_RATIOS, ROOM_TYPES } from './constants';

export type StagingStyle = typeof STAGING_STYLES[number];
export type AspectRatio = typeof ASPECT_RATIOS[number];
export type RoomType = typeof ROOM_TYPES[number];

export interface StagedImageFile {
    id: string;
    file: File;
    previewUrl: string;
    stagedUrl: string | null;
    isLoading: boolean;
    error: string | null;
    roomType: RoomType;
    feedbackText: string;
}