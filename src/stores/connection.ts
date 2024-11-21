import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

export const useConnectionStore = defineStore('connection', {
    state: () => ({
        isConnected: false,
        socket: null as Socket | null
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
                this.socket?.emit('events', { test: 'test' });
                this.socket?.emit('identity', 0, (response: number) =>
                    console.log('Identity:', response)
                );
            });

            this.socket?.on('disconnect', () => {
                this.isConnected = false;
                console.log('Disconnected');
            });

            this.socket?.on('events', function (data) {
                console.log('event', data);
            });

            this.socket?.on('exception', function (data) {
                console.log('exception', data);
            });
        },

        connect() {
            this.socket?.connect();
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
