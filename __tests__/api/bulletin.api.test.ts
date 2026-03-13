import {configureStore} from '@reduxjs/toolkit';
import {bulletinApi} from '@/src/store/api/bulletin.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[bulletinApi.reducerPath]: bulletinApi.reducer},
    middleware: gDM => gDM().concat(bulletinApi.middleware),
  });

const getRequestUrl = (): string => {
  const call = fetchMock.mock.calls[0][0];
  return typeof call === 'string' ? call : (call as any).parsedURL?.href ?? call.url;
};

const getRequestMethod = (): string => {
  const call = fetchMock.mock.calls[0][0];
  if (typeof call === 'string') return (fetchMock.mock.calls[0][1] as any)?.method ?? 'GET';
  return (call as any).method ?? 'GET';
};


describe('bulletinApi', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.resetMocks();
    store = createTestStore();
  });

  afterEach(() => {
    store.dispatch(bulletinApi.util.resetApiState());
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  //---------------------------------------
  it('getBulletins sends GET /bulletins with pagination', async () => {
    const mockResponse = {
      data: [],
      meta: {page: 1, limit: 10, total: 0, totalPages: 0},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      bulletinApi.endpoints.getBulletins.initiate({limit: 10, page: 1}),
    );

    const url = getRequestUrl();
    expect(url).toContain('/bulletins');
    expect(url).toContain('limit=10');
    expect(url).toContain('page=1');
    expect(result.data).toEqual(mockResponse);
  });

  //---------------------------------------
  it('getBulletinDetail sends GET /bulletins/posts/:id', async () => {
    const mockPost = {id: 'post-1', title: 'Test Post'};
    fetchMock.mockResponseOnce(JSON.stringify({data: mockPost}));

    const result = await store.dispatch(
      bulletinApi.endpoints.getBulletinDetail.initiate('post-1'),
    );

    expect(getRequestUrl()).toContain('/bulletins/posts/post-1');
    expect(result.data).toEqual(mockPost);
  });

  //---------------------------------------
  it('toggleLike sends POST /bulletins/posts/:id/likes', async () => {
    const mockResponse = {data: {likeCount: 5, isLiked: true}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      bulletinApi.endpoints.toggleLike.initiate('post-1'),
    );

    expect(getRequestUrl()).toContain('/bulletins/posts/post-1/likes');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual(mockResponse.data);
  });

  //---------------------------------------
  it('getComments sends GET /bulletins/posts/:id/comments', async () => {
    const mockResponse = {
      data: [],
      meta: {page: 1, limit: 10, total: 0, totalPages: 0},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    await store.dispatch(
      bulletinApi.endpoints.getComments.initiate('post-1'),
    );

    expect(getRequestUrl()).toContain('/bulletins/posts/post-1/comments');
  });

  //---------------------------------------
  it('createComment sends POST /bulletins/posts/:id/comments', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({id: 'comment-1', content: 'Nice!'}),
    );

    await store.dispatch(
      bulletinApi.endpoints.createComment.initiate({
        postId: 'post-1',
        content: 'Nice!',
      }),
    );

    expect(getRequestUrl()).toContain('/bulletins/posts/post-1/comments');
    expect(getRequestMethod()).toBe('POST');
  });

  //---------------------------------------
  it('createComment with parentId sends POST to correct endpoint', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({id: 'comment-2'}));

    await store.dispatch(
      bulletinApi.endpoints.createComment.initiate({
        postId: 'post-1',
        content: 'Reply',
        parentId: 'comment-1',
      }),
    );

    expect(getRequestUrl()).toContain('/bulletins/posts/post-1/comments');
    expect(getRequestMethod()).toBe('POST');
  });

  //---------------------------------------
  it('updateComment sends PATCH /bulletins/comments/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({id: 'comment-1'}));

    await store.dispatch(
      bulletinApi.endpoints.updateComment.initiate({
        commentId: 'comment-1',
        postId: 'post-1',
        content: 'Updated comment',
      }),
    );

    expect(getRequestUrl()).toContain('/bulletins/comments/comment-1');
    expect(getRequestMethod()).toBe('PATCH');
  });

  //---------------------------------------
  it('deleteComment sends DELETE /bulletins/comments/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await store.dispatch(
      bulletinApi.endpoints.deleteComment.initiate({
        commentId: 'comment-1',
        postId: 'post-1',
      }),
    );

    expect(getRequestUrl()).toContain('/bulletins/comments/comment-1');
    expect(getRequestMethod()).toBe('DELETE');
  });

  //---------------------------------------
  it('toggleCommentLike sends POST /bulletins/comments/:id/likes', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {likeCount: 3, isLiked: true}}),
    );

    await store.dispatch(
      bulletinApi.endpoints.toggleCommentLike.initiate({
        commentId: 'comment-1',
        postId: 'post-1',
      }),
    );

    expect(getRequestUrl()).toContain('/bulletins/comments/comment-1/likes');
    expect(getRequestMethod()).toBe('POST');
  });
});
