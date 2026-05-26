import { sendConnectionRequest, acceptConnectionRequest, getSuggestions } from './ConnectionService';
import axiosInstance from '../Interceptor/AxiosInterceptor';

// Mock the axios instance
jest.mock('../Interceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

describe('ConnectionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('sendConnectionRequest correctly formats URL and payload', async () => {
        const mockResponse = { data: { id: 10, status: 'PENDING' } };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await sendConnectionRequest(1, 2);

        expect(axiosInstance.post).toHaveBeenCalledWith('/connections/send/1/2');
        expect(result).toEqual(mockResponse.data);
    });

    test('acceptConnectionRequest correctly sends to endpoint', async () => {
        const mockResponse = { data: { id: 10, status: 'ACCEPTED' } };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await acceptConnectionRequest(10);

        expect(axiosInstance.post).toHaveBeenCalledWith('/connections/accept/10');
        expect(result).toEqual(mockResponse.data);
    });

    test('getSuggestions fetches correct URL', async () => {
        const mockProfiles = { data: [{ id: 5, name: 'John' }, { id: 6, name: 'Jane' }] };
        (axiosInstance.get as jest.Mock).mockResolvedValue(mockProfiles);

        const result = await getSuggestions(1);

        expect(axiosInstance.get).toHaveBeenCalledWith('/connections/suggestions/1');
        expect(result).toEqual(mockProfiles.data);
    });
});
