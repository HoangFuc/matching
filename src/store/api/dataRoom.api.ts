// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {_retrieveData} from '@/src/api/async.storage';
// import config from '../../../config.json';
//
// const API_URL = config.API_BASE_URL;

export interface IFolder {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFile {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFolderPayload {
  name: string;
  type: string;
}

export interface IMoveFilePayload {
  fileId: string;
  targetFolderId: string;
}

export interface IRenamePayload {
  id: string;
  name: string;
  kind: 'file' | 'folder';
}

// ============================================================
// FAKE DATA - 실제 API 연결 전까지 사용
// ============================================================

export const FAKE_FOLDERS: IFolder[] = [
  {
    id: '1',
    name: 'OO 분양 자료',
    type: '시세 자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: '2',
    name: '미국 힐스테이트 분양자료',
    type: '시세 자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: '3',
    name: '위례 포레스트 분양자료',
    type: '분양자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: '4',
    name: '개포 래미안 분양자료',
    type: '분양자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: '5',
    name: '반포 센트럴 분양자료',
    type: '시세 자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: '6',
    name: '한남 아이파크 분양자료',
    type: '분양자료',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
];

export const FAKE_FILES: IFile[] = [
  {
    id: 'f1',
    name: '송도 힐스테이트.pdf',
    folderId: '1',
    size: 2048000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f2',
    name: '마곡 엠벨리 7단지.exe',
    folderId: '1',
    size: 5120000,
    mimeType: 'application/octet-stream',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f3',
    name: '위례 포레스트 사랑으로 부영.pdf',
    folderId: '1',
    size: 3072000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f4',
    name: '동탄 파크릭스 신동아 파밀리에.exe',
    folderId: '1',
    size: 4096000,
    mimeType: 'application/octet-stream',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f5',
    name: '검단 금호어울림 에듀포레.pdf',
    folderId: '1',
    size: 1536000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f6',
    name: '파주 운정 라피아노.pdf',
    folderId: '1',
    size: 2560000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f6b',
    name: '광교 중흥S클래스.pdf',
    folderId: '1',
    size: 1800000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f7',
    name: '힐스테이트 분석자료.pdf',
    folderId: '2',
    size: 1024000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
  {
    id: 'f8',
    name: '위례 포레스트 계약서.pdf',
    folderId: '3',
    size: 2048000,
    mimeType: 'application/pdf',
    createdAt: '2025.12.13',
    updatedAt: '2025.12.13',
  },
];

// ============================================================
// FAKE HOOKS - RTK Query hooks 대체
// TODO: 실제 API 연결 시 아래 createApi 코드로 교체
// ============================================================

export const useGetFoldersQuery = () => ({
  data: FAKE_FOLDERS,
  isLoading: false,
  isError: false,
  refetch: () => {},
});

export const useCreateFolderMutation = (): [
  (payload: ICreateFolderPayload) => {unwrap: () => Promise<IFolder>},
  {isLoading: boolean},
] => {
  return [
    (payload: ICreateFolderPayload) => ({
      unwrap: () =>
        Promise.resolve({
          id: String(Date.now()),
          name: payload.name,
          type: payload.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
    }),
    {isLoading: false},
  ];
};

export const useGetFilesByFolderQuery = (folderId: string) => ({
  data: FAKE_FILES.filter(f => f.folderId === folderId),
  isLoading: false,
  isError: false,
  refetch: () => {},
});

export const useSearchFilesQuery = (keyword: string) => ({
  data: FAKE_FILES.filter(f =>
    f.name.toLowerCase().includes(keyword.toLowerCase()),
  ),
  isLoading: false,
  isError: false,
});

export const useMoveFileMutation = (): [
  (payload: IMoveFilePayload) => {unwrap: () => Promise<void>},
  {isLoading: boolean},
] => {
  return [
    (_payload: IMoveFilePayload) => ({
      unwrap: () => Promise.resolve(),
    }),
    {isLoading: false},
  ];
};

export const useRenameItemMutation = (): [
  (payload: IRenamePayload) => {unwrap: () => Promise<void>},
  {isLoading: boolean},
] => {
  return [
    (_payload: IRenamePayload) => ({
      unwrap: () => Promise.resolve(),
    }),
    {isLoading: false},
  ];
};

export const useDeleteFileMutation = (): [
  (fileId: string) => {unwrap: () => Promise<void>},
  {isLoading: boolean},
] => {
  return [
    (_fileId: string) => ({
      unwrap: () => Promise.resolve(),
    }),
    {isLoading: false},
  ];
};

export interface IMoveFolderPayload {
  folderId: string;
  targetType: string;
}

export const useMoveFolderMutation = (): [
  (payload: IMoveFolderPayload) => {unwrap: () => Promise<void>},
  {isLoading: boolean},
] => {
  return [
    (_payload: IMoveFolderPayload) => ({
      unwrap: () => Promise.resolve(),
    }),
    {isLoading: false},
  ];
};

export const useDeleteFolderMutation = (): [
  (folderId: string) => {unwrap: () => Promise<void>},
  {isLoading: boolean},
] => {
  return [
    (_folderId: string) => ({
      unwrap: () => Promise.resolve(),
    }),
    {isLoading: false},
  ];
};

// ============================================================
// TODO: 실제 API 연결 시 아래 코드를 uncomment하고 위 fake hooks 삭제
// ============================================================
//
// export const dataRoomApi = createApi({
//   reducerPath: 'dataRoomApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_URL}/data-room`,
//     prepareHeaders: async headers => {
//       const auth = await _retrieveData('auth');
//       const token = JSON.parse(auth || '{}')?.accessToken;
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Folders', 'Files'],
//   endpoints: builder => ({
//     getFolders: builder.query<IFolder[], void>({
//       query: () => '/folders',
//       providesTags: ['Folders'],
//     }),
//     createFolder: builder.mutation<IFolder, ICreateFolderPayload>({
//       query: body => ({
//         url: '/folders',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: ['Folders'],
//     }),
//     getFilesByFolder: builder.query<IFile[], string>({
//       query: folderId => `/folders/${folderId}/files`,
//       providesTags: (_result, _error, folderId) => [
//         {type: 'Files', id: folderId},
//       ],
//     }),
//     searchFiles: builder.query<IFile[], string>({
//       query: keyword => `/files/search?keyword=${encodeURIComponent(keyword)}`,
//     }),
//     moveFile: builder.mutation<void, IMoveFilePayload>({
//       query: ({fileId, targetFolderId}) => ({
//         url: `/files/${fileId}/move`,
//         method: 'PUT',
//         body: {targetFolderId},
//       }),
//       invalidatesTags: ['Files'],
//     }),
//     renameItem: builder.mutation<void, IRenamePayload>({
//       query: ({id, name, kind}) => ({
//         url: `/${kind}s/${id}/rename`,
//         method: 'PUT',
//         body: {name},
//       }),
//       invalidatesTags: ['Folders', 'Files'],
//     }),
//     deleteFile: builder.mutation<void, string>({
//       query: fileId => ({
//         url: `/files/${fileId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Files'],
//     }),
//     deleteFolder: builder.mutation<void, string>({
//       query: folderId => ({
//         url: `/folders/${folderId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Folders'],
//     }),
//   }),
// });
//
// export const {
//   useGetFoldersQuery,
//   useCreateFolderMutation,
//   useGetFilesByFolderQuery,
//   useSearchFilesQuery,
//   useMoveFileMutation,
//   useRenameItemMutation,
//   useDeleteFileMutation,
//   useDeleteFolderMutation,
// } = dataRoomApi;
