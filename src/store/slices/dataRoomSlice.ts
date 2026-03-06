import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IDataRoomState {
  selectedFolderId: string | null;
  selectedFolderName: string | null;
  viewMode: 'list' | 'grid';
  searchKeyword: string;
}

const initialState: IDataRoomState = {
  selectedFolderId: null,
  selectedFolderName: null,
  viewMode: 'list',
  searchKeyword: '',
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
  resetDataRoom,
} = dataRoomSlice.actions;

export default dataRoomSlice.reducer;
