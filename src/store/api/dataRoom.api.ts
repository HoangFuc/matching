import { TDataRoomTabType } from '@/src/screens/dataRoom/constants';
import { API_BASE_URL, TOKEN } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export interface IFolder {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFile {
  id: string;
  originalName: string;
  folderId: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFolderPayload {
  name: string;
  type: TDataRoomTabType;
}

export interface ISearchResponse {
  folders: IFolder[];
  files: IFile[];
}

export interface IUploadFilePayload {
  folderId: string;
  files: { uri: string; name: string; type: string }[];
}

export interface IMoveFilePayload {
  fileId: string;
  newFolderId: string;
}

export interface IRenamePayload {
  id: string;
  name: string;
  kind: 'file' | 'folder';
}

export const dataRoomApi = createApi({
  reducerPath: 'dataRoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/data-room`,
    prepareHeaders: async headers => {
      // const auth = await _retrieveData('auth');
      // const token = JSON.parse(auth || '{}')?.accessToken;
      const token = TOKEN;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Folders', 'Files'],
  endpoints: builder => ({
    getFolders: builder.query<IFolder[], void>({
      query: () => '/folders',
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.data ?? [],
      providesTags: ['Folders'],
    }),
    createFolder: builder.mutation<IFolder, ICreateFolderPayload>({
      query: body => ({
        url: '/folders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Folders'],
    }),
    getFilesByFolder: builder.query<IFile[], string>({
      query: folderId => `/folders/${folderId}/files`,
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.data ?? [],
      providesTags: (_result, _error, folderId) => [
        { type: 'Files', id: folderId },
      ],
    }),
    search: builder.query<ISearchResponse, string>({
      query: keyword => `/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: (response: any): ISearchResponse => ({
        folders: response?.data?.folders ?? [],
        files: response?.data?.files ?? [],
      }),
    }),
    moveFile: builder.mutation<void, IMoveFilePayload>({
      query: ({ fileId, newFolderId }) => ({
        url: `/files/${fileId}/move`,
        method: 'PATCH',
        body: { newFolderId },
      }),
      invalidatesTags: ['Files'],
    }),
    renameItem: builder.mutation<void, IRenamePayload>({
      query: ({ id, name, kind }) => ({
        url: `/${kind}s/${id}/rename`,
        method: 'PATCH',
        body: { newName: name },
      }),
      invalidatesTags: ['Folders', 'Files'],
    }),
    deleteFile: builder.mutation<void, string>({
      query: fileId => ({
        url: `/files/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Files'],
    }),
    uploadFile: builder.mutation<IFile[], IUploadFilePayload>({
      query: ({ folderId, files }) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('file', {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name || 'file',
          } as any);
        });
        return {
          url: `/folders/${folderId}/files`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, { folderId }) => [
        { type: 'Files', id: folderId },
      ],
    }),
    deleteFolder: builder.mutation<void, string>({
      query: folderId => ({
        url: `/folders/${folderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Folders'],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useGetFilesByFolderQuery,
  useSearchQuery,
  useMoveFileMutation,
  useRenameItemMutation,
  useDeleteFileMutation,
  useUploadFileMutation,
  useDeleteFolderMutation,
} = dataRoomApi;
