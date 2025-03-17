import type { VariableChartData } from '@/common_components/charts/VariableGenesChart.vue';
import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

enum ResponseType {
    INFO = 'info',
    ERROR = 'error',
    SUCCESS = 'success'
}

interface ResponseData {
    content: object;
    status: string;
    error: string;
}

interface Response {
    data: ResponseData;
    type: ResponseType;
}

export const useQCStore = defineStore('connection', {
    state: () => ({
        isConnected: false,
        socket: null as Socket | null,
        pca_variance_ratio: {},
        violin_and_scatter_plot_data: {},
        highly_variable_genes_data: {},
        umap_data: {}
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

            this.socket?.on('qc:status', (response: Response) => {
                if (response.type == ResponseType.INFO) {
                    if (response.data.status == 'pca_variance_ratio') {
                        this.pca_variance_ratio = response.data.content;
                    } else if (response.data.status == 'violin_and_scatter_plot_data') {
                        this.violin_and_scatter_plot_data = response.data.content;
                    } else if (response.data.status == 'highly_variable_genes_data') {
                        this.highly_variable_genes_data = response.data
                            .content as VariableChartData;
                    } else if (response.data.status == 'umap_data') {
                        this.umap_data = response.data.content;
                    }
                }
            });
        },

        fetchData(data: object) {
            this.socket?.emit('data', data, (response: Response) => {
                if (response.type == ResponseType.SUCCESS) {
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
