import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface MessagePayload {
    id?: string;
    chatRoomId: string;
    senderId: number;
    recipientId: number;
    text: string;
    timestamp?: string;
}

export interface ChatRoomPayload {
    id: string;
    user1Id: number;
    user2Id: number;
    user1Name: string;
    user2Name: string;
    user1Role: string;
    user2Role: string;
    lastMessage: string;
    lastActive: string;
}

export const getOrCreateRoom = async (senderId: number, recipientId: number): Promise<ChatRoomPayload> => {
    return axiosInstance.post(`/chats/room?senderId=${senderId}&recipientId=${recipientId}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err; });
};

export const getOrCreateRoomByUser = async (senderId: number, recipientUserId: number): Promise<ChatRoomPayload> => {
    return axiosInstance.post(`/chats/room-by-user?senderId=${senderId}&recipientUserId=${recipientUserId}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err; });
};

export const getConversations = async (profileId: number): Promise<ChatRoomPayload[]> => {
    return axiosInstance.get(`/chats/conversations/${profileId}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err; });
};

export const getMessages = async (chatRoomId: string): Promise<MessagePayload[]> => {
    return axiosInstance.get(`/chats/messages/${chatRoomId}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err; });
};

export const sendMessage = async (message: MessagePayload): Promise<MessagePayload> => {
    return axiosInstance.post(`/chats/send`, message)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err; });
};
