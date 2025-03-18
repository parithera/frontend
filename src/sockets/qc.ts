import type { UMAPData } from '@/common_components/charts/ScatterChart.vue';
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

interface PCAVarianceRatio {
    pca_variance_ratio: Array<number>;
}

interface ViolinAndScatterPlot {
    n_genes_by_counts: Array<number>;
    total_counts: Array<number>;
    pct_counts_mt: Array<number>;
}

interface HighlyVariableScatterPlot {
    highly_variable: Array<boolean>;
    dispersions: Array<number>;
    means: Array<number>;
}

interface UMAP {
    data: Array<UMAPData>;
}

export const useQCStore = defineStore('connection', {
    state: () => ({
        isConnected: false,
        socket: null as Socket | null,
        pca_variance_ratio: {
            pca_variance_ratio: []
        } as PCAVarianceRatio,
        violin_and_scatter_plot_data: {
            n_genes_by_counts: [],
            total_counts: [],
            pct_counts_mt: []
        } as ViolinAndScatterPlot,
        highly_variable_genes_data: {
            highly_variable: [],
            dispersions: [],
            means: []
        } as HighlyVariableScatterPlot,
        umap_data: {
            data: []
        } as UMAP
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
                        this.pca_variance_ratio = response.data.content as PCAVarianceRatio;
                    } else if (response.data.status == 'violin_and_scatter_plot_data') {
                        this.violin_and_scatter_plot_data = response.data
                            .content as ViolinAndScatterPlot;
                    } else if (response.data.status == 'highly_variable_genes_data') {
                        this.highly_variable_genes_data = response.data
                            .content as HighlyVariableScatterPlot;
                    } else if (response.data.status == 'umap_data') {
                        this.umap_data = response.data.content as UMAP;
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
