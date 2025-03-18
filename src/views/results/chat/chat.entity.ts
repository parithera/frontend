import type { JSONScatter, JSONUMAP } from './types';

export interface Chat {
    id: string;
    messages: Message[];
}

export interface Message {
    request: string;
    code: string;
    followup: string[];
    text: string;
    json: JSONUMAP | JSONScatter;
    image: string;
    agent: string;
    error: string;
    status: string;
    timestamp: Date;
}
