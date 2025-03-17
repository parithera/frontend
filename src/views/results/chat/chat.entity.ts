export interface Chat {
    id: string;
    messages: Message[];
}

export interface Message {
    request: string;
    code: string;
    followup: string[];
    text: string;
    json: object;
    image: string;
    agent: string;
    error: string;
    status: string;
    timestamp: Date;
}
