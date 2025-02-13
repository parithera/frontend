export interface Chat {
    id: string;
    messages: Message[];
}

export interface Message {
    request: string;
    code: string;
    followup: string[]
    text: string;
    JSON: object;
    image: string;
    agent: string;
    error: string;
    timestamp: Date;
}
