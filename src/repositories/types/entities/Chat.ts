export interface Chat {
    id: string;
    messages: Message[];
}

export interface Message {
    request: string;
    response: string;
    image: string;
}
