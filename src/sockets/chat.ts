import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

enum ResponseType {
    INFO = 'info',
    ERROR = 'error',
    SUCCESS = 'success'
}

interface ResponseData {
    code: string;
    followup: Array<string>;
    text: string;
    json: object;
    image: string;
    error: string;
    status: string;
    agent: string;
}

interface Response {
    data: ResponseData;
    type: ResponseType;
}

interface Request {
    request: string;
    projectId: string;
    userId: string;
    organizationId: string;
}

export const useChatStore = defineStore('chat', {
    state: () => ({
        isConnected: false,
        socket: null as Socket | null,
        response: null as Response | null,
        request: ''
    }),
    getters: {
        getSocket(): Socket {
            return this.socket as Socket;
        }
    },

    actions: {
        bindEvents() {
            this.socket?.on('connect', () => {
                console.log('Connected');
                this.isConnected = true;
            });

            this.socket?.on('disconnect', () => {
                console.log('Disconnected');
                this.isConnected = false;
            });

            this.socket?.on('exception', function (data) {
                console.log('exception', data);
            });

            this.socket?.on('chat:status', (response: Response) => {
                if (response.type == ResponseType.INFO) {
                    this.response = response;
                }
            });
        },

        askChat(data: Request) {
            this.request = data.request;
            this.socket?.emit('chat', data, (response: Response) => {
                if (response.type == ResponseType.SUCCESS) {
                    this.socket?.disconnect();
                    this.response = response;
                } else if (response.type == ResponseType.ERROR) this.socket?.disconnect();
            });
        },

        connect() {
            this.socket?.connect();
        },

        disconnect() {
            this.socket?.disconnect();
        },

        createSocket(token: string) {
            const URL =
                process.env.NODE_ENV === 'production'
                    ? `https://${window.location.hostname}`
                    : 'http://localhost:3000';

            const path =
                process.env.NODE_ENV === 'production'
                    ? `/${import.meta.env.VITE_API_URL}/socket.io/`
                    : `/socket.io/`;

            this.socket = io(URL, {
                path: path,
                autoConnect: false,
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                }
            });
        }
    }
});
