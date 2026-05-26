import { createPost, getAllPosts, likePost } from './PostService';
import axiosInstance from '../Interceptor/AxiosInterceptor';

// Mock the axios instance
jest.mock('../Interceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

describe('PostService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createPost sends correct payload', async () => {
        const postPayload = { profileId: 1, content: 'Hello World', image: null };
        const mockResponse = { data: { id: 100, ...postPayload } };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await createPost(postPayload);

        expect(axiosInstance.post).toHaveBeenCalledWith('/posts/create', postPayload);
        expect(result).toEqual(mockResponse.data);
    });

    test('getAllPosts sends userId and sort parameters', async () => {
        const mockFeed = { data: [{ id: 100 }, { id: 101 }] };
        (axiosInstance.get as jest.Mock).mockResolvedValue(mockFeed);

        const result = await getAllPosts(1, 'Recent');

        expect(axiosInstance.get).toHaveBeenCalledWith('/posts/all?userId=1&sort=Recent');
        expect(result).toEqual(mockFeed.data);
    });

    test('likePost formats the URL correctly', async () => {
        const mockResponse = { data: { id: 100, likedBy: [1] } };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await likePost(100, 1);

        expect(axiosInstance.post).toHaveBeenCalledWith('/posts/like/100/1');
        expect(result).toEqual(mockResponse.data);
    });
});
