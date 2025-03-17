export type ChatContent = {
    request: string;
    response: string;
    image: string;
    data: string;
    text: string;
    result: string;
};

export type Group = {
    name: string;
    files: Array<string>;
};
