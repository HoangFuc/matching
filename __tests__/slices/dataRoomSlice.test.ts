import reducer, {
  setSelectedFolder,
  clearSelectedFolder,
  toggleViewMode,
  setViewMode,
  setSearchKeyword,
  setUploadProgress,
  updateUploadProgress,
  clearUploadProgress,
  resetDataRoom,
  IUploadProgress,
} from '@/src/store/slices/dataRoomSlice';

const initialState = {
  selectedFolderId: null,
  selectedFolderName: null,
  viewMode: 'list' as const,
  searchKeyword: '',
  uploadProgress: null,
};

describe('dataRoomSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  //---------------------------------------
  describe('folder selection', () => {
    it('setSelectedFolder sets folder id and name', () => {
      const state = reducer(
        initialState,
        setSelectedFolder({id: 'folder-1', name: 'Documents'}),
      );
      expect(state.selectedFolderId).toBe('folder-1');
      expect(state.selectedFolderName).toBe('Documents');
    });

    it('clearSelectedFolder resets to null', () => {
      const stateWithFolder = {
        ...initialState,
        selectedFolderId: 'folder-1',
        selectedFolderName: 'Documents',
      };
      const state = reducer(stateWithFolder, clearSelectedFolder());
      expect(state.selectedFolderId).toBeNull();
      expect(state.selectedFolderName).toBeNull();
    });
  });

  //---------------------------------------
  describe('view mode', () => {
    it('toggleViewMode switches list to grid', () => {
      const state = reducer(initialState, toggleViewMode());
      expect(state.viewMode).toBe('grid');
    });

    it('toggleViewMode switches grid to list', () => {
      const gridState = {...initialState, viewMode: 'grid' as const};
      const state = reducer(gridState, toggleViewMode());
      expect(state.viewMode).toBe('list');
    });

    it('setViewMode sets specific mode', () => {
      const state = reducer(initialState, setViewMode('grid'));
      expect(state.viewMode).toBe('grid');
    });
  });

  //---------------------------------------
  describe('search', () => {
    it('setSearchKeyword updates keyword', () => {
      const state = reducer(initialState, setSearchKeyword('report'));
      expect(state.searchKeyword).toBe('report');
    });
  });

  //---------------------------------------
  describe('upload progress', () => {
    const mockProgress: IUploadProgress = {
      uploadId: 'upload-1',
      status: 'uploading',
      percent: 50,
      fileName: 'file.pdf',
    };

    it('setUploadProgress sets progress', () => {
      const state = reducer(initialState, setUploadProgress(mockProgress));
      expect(state.uploadProgress).toEqual(mockProgress);
    });

    it('updateUploadProgress updates partial fields', () => {
      const stateWithProgress = {...initialState, uploadProgress: mockProgress};
      const state = reducer(
        stateWithProgress,
        updateUploadProgress({percent: 75, status: 'uploading'}),
      );
      expect(state.uploadProgress?.percent).toBe(75);
      expect(state.uploadProgress?.fileName).toBe('file.pdf');
    });

    it('updateUploadProgress does nothing when no progress exists', () => {
      const state = reducer(
        initialState,
        updateUploadProgress({percent: 75}),
      );
      expect(state.uploadProgress).toBeNull();
    });

    it('clearUploadProgress resets to null', () => {
      const stateWithProgress = {...initialState, uploadProgress: mockProgress};
      const state = reducer(stateWithProgress, clearUploadProgress());
      expect(state.uploadProgress).toBeNull();
    });
  });

  //---------------------------------------
  describe('reset', () => {
    it('resetDataRoom returns initial state', () => {
      const modifiedState = {
        selectedFolderId: 'folder-1',
        selectedFolderName: 'Docs',
        viewMode: 'grid' as const,
        searchKeyword: 'test',
        uploadProgress: {
          uploadId: 'u1',
          status: 'uploading' as const,
          percent: 50,
          fileName: 'f.pdf',
        },
      };
      const state = reducer(modifiedState, resetDataRoom());
      expect(state).toEqual(initialState);
    });
  });
});
