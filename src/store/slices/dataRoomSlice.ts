import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IUploadProgress {
  uploadId: string;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  percent: number;
  fileName: string;
  error?: string;
}

interface IDataRoomState {
  selectedFolderId: string | null;
  selectedFolderName: string | null;
  viewMode: 'list' | 'grid';
  searchKeyword: string;
  uploadProgress: IUploadProgress | null;
}

const initialState: IDataRoomState = {
  selectedFolderId: null,
  selectedFolderName: null,
  viewMode: 'list',
  searchKeyword: '',
  uploadProgress: null,
};

const dataRoomSlice = createSlice({
  name: 'dataRoom',
  initialState,
  reducers: {
    setSelectedFolder(
      state,
      action: PayloadAction<{id: string; name: string}>,
    ) {
      state.selectedFolderId = action.payload.id;
      state.selectedFolderName = action.payload.name;
    },
    clearSelectedFolder(state) {
      state.selectedFolderId = null;
      state.selectedFolderName = null;
    },
    toggleViewMode(state) {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list';
    },
    setViewMode(state, action: PayloadAction<'list' | 'grid'>) {
      state.viewMode = action.payload;
    },
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchKeyword = action.payload;
    },
    setUploadProgress(state, action: PayloadAction<IUploadProgress>) {
      state.uploadProgress = action.payload;
    },
    updateUploadProgress(
      state,
      action: PayloadAction<Partial<IUploadProgress>>,
    ) {
      if (state.uploadProgress) {
        Object.assign(state.uploadProgress, action.payload);
      }
    },
    clearUploadProgress(state) {
      state.uploadProgress = null;
    },
    resetDataRoom() {
      return initialState;
    },
  },
});

export const {
  setSelectedFolder,
  clearSelectedFolder,
  toggleViewMode,
  setViewMode,
  setSearchKeyword,
  setUploadProgress,
  updateUploadProgress,
  clearUploadProgress,
  resetDataRoom,
} = dataRoomSlice.actions;

export default dataRoomSlice.reducer;
