import { prepareUploadData, fetchUpload } from '@/src/services/uploadService';
import { TDataRoomTabType } from '@/src/screens/dataRoom/constants';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
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

export interface IInitUploadPayload {
  folderId?: string;
  type?: TDataRoomTabType;
}

export interface IInitUploadResponse {
  uploadId: string;
}

export interface IUploadFilePayload {
  uploadId: string;
  file: { uri: string; name: string; type: string };
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
  baseQuery: createBaseQuery('/data-room'),
  tagTypes: ['Folders', 'Files'],
  endpoints: builder => ({
    getFolders: builder.query<ISearchResponse, TDataRoomTabType>({
      query: type => ({
        url: '/folders',
        params: { type },
      }),
      transformResponse: (response: any): ISearchResponse => {
        const data = response?.data?.data;
        if (Array.isArray(data)) {
          const folders: IFolder[] = [];
          const files: IFile[] = [];
          data.forEach((item: any) => {
            if (item.fileUrl) {
              files.push(item);
            } else {
              folders.push(item);
            }
          });
          return { folders, files };
        }
        return {
          folders: data?.folders ?? [],
          files: data?.files ?? [],
        };
      },
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
        Array.isArray(response) ? response : response?.data?.data ?? [],
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
    initUpload: builder.mutation<IInitUploadResponse, IInitUploadPayload>({
      query: body => ({
        url: '/uploads/init',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
    uploadFileById: builder.mutation<null, IUploadFilePayload>({
      async queryFn({ uploadId, file }) {
        try {
          const uploadData = await prepareUploadData(file, 'stream');
          const response = await fetchUpload(
            `data-room/uploads/${uploadId}`,
            uploadData,
          );
          const status = response.info().status;
          if (status < 200 || status >= 300) {
            const errorData = response.json();
            return { error: { status, data: errorData } };
          }
          return { data: null };
        } catch (err) {
          return {
            error: { status: 'FETCH_ERROR', error: String(err) },
          };
        }
      },
      invalidatesTags: ['Folders', 'Files'],
    }),
    cancelUpload: builder.mutation<void, string>({
      query: uploadId => ({
        url: `/uploads/${uploadId}`,
        method: 'DELETE',
      }),
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
  useInitUploadMutation,
  useUploadFileByIdMutation,
  useCancelUploadMutation,
  useDeleteFolderMutation,
} = dataRoomApi;
