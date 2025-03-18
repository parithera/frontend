import type { UMAPData } from '@/common_components/charts/ScatterChart.vue';

export type ChatContent = {
    request: string;
    code: string;
    followup: Array<string>;
    text: string;
    json: JSONUMAP | JSONScatter;
    image: string;
    error: string;
    status: string;
    agent: string;
};

export type JSONUMAP = {
    type: string;
    data: Array<UMAPData>;
};

export type JSONScatter = {
    type: string;
    data: {
        umaps: {
            gene: Array<UMAPData>;
        };
    };
};

export type Group = {
    name: string;
    files: Array<string>;
};

export type SampleElement = {
    name: string;
    id: string;
};
