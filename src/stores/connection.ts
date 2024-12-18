import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

interface Response {
    data: string;
    type: string;
}

export const useConnectionStore = defineStore('connection', {
    state: () => ({
        isConnected: false,
        socket: null as Socket | null,
        svg_elbow: '',
        svg_umap: '',
        svg_variable_features: '',
        svg_violin: ''
    }),
    getters: {
        getSocket(): Socket {
            return this.socket as Socket;
        }
    },

    actions: {
        $reset(){
            this.svg_elbow = ''
            this.svg_umap = ''
            this.svg_variable_features = ''
            this.svg_violin = ''
        },
        bindEvents() {
            this.socket?.on('connect', () => {
                console.log('Connected');
                this.isConnected = true;
            });

            this.socket?.on('disconnect', () => {
                this.isConnected = false;
                console.log('Disconnected');
            });

            this.socket?.on('exception', function (data) {
                console.log('exception', data);
            });
        },

        fetchGraphs(data: object) {
            this.socket?.emit('graphs', data, (response: Response) => {
                if (response.type == 'pca_variance_ratio') this.svg_elbow = response.data;
                else if (response.type == 'violin') this.svg_violin = response.data;
                else if (response.type == 'umap') this.svg_umap = response.data;
                else if (response.type == 'filter_genes_dispersion')
                    this.svg_variable_features = response.data;

                if (
                    this.svg_elbow != '' &&
                    this.svg_umap != '' &&
                    this.svg_violin != '' &&
                    this.svg_variable_features != ''
                ) {
                    this.socket?.disconnect();
                }
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
