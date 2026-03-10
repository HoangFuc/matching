import { TDataRoomTabType } from '@/src/screens/dataRoom/constants';
import { API_BASE_URL, TOKEN } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export interface IFolder {
  id: string;
  companyId: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    files: number;
  };
}

export interface IFile {
  id: string;
  companyId: string;
  folderId: string | null;
  type: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
}

export interface ICreateFolderPayload {
  name: string;
  type: TDataRoomTabType;
}

export interface ISearchResponse {
  folders: IFolder[];
  files: IFile[];
}

export interface IUploadFileInFolderPayload {
  folderId: string;
  files: { uri: string; name: string; type: string }[];
}

export interface IUploadFilePayload {
  files: { uri: string; name: string; type: string }[];
}

export interface IUploadResponse {
  uploadId: string;
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
    getFolders: builder.query<ISearchResponse, TDataRoomTabType>({
      query: type => ({
        url: '/folders',
        params: { type },
      }),
      transformResponse: (response: any): ISearchResponse => ({
        folders: response?.data?.folders ?? [],
        files: response?.data?.files ?? [],
      }),
      providesTags: (_result, _error, type) => [{ type: 'Folders', id: type }],
    }),
    createFolder: builder.mutation<IFolder, ICreateFolderPayload>({
      query: body => ({
        url: '/folders',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Folders', id: body.type },
      ],
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
    uploadFileInFolder: builder.mutation<
      IUploadResponse,
      IUploadFileInFolderPayload
    >({
      queryFn: async ({ folderId, files }) => {
        try {
          const formData = new FormData();
          files.forEach(file => {
            formData.append('file', {
              uri: file.uri,
              type: file.type || 'application/octet-stream',
              name: file.name || 'file',
            } as any);
          });

          const response = await fetch(
            `${API_BASE_URL}/data-room/folders/${folderId}/files`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
              body: formData,
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: errorData } };
          }

          const data = await response.json();
          return { data: data?.data as IUploadResponse };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: (_r, _e, { folderId }) => [
        { type: 'Files', id: folderId },
      ],
    }),
    uploadFile: builder.mutation<IUploadResponse, IUploadFilePayload>({
      queryFn: async ({ files }) => {
        try {
          const formData = new FormData();
          files.forEach(file => {
            formData.append('file', {
              uri: file.uri,
              type: file.type || 'application/octet-stream',
              name: file.name || 'file',
            } as any);
          });

          const response = await fetch(
            `${API_BASE_URL}/data-room/files`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
              body: formData,
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: errorData } };
          }

          const data = await response.json();
          return { data: data?.data as IUploadResponse };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: ['Files'],
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
  useUploadFileInFolderMutation,
  useUploadFileMutation,
  useDeleteFolderMutation,
} = dataRoomApi;
