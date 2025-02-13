export type ChatContent = {
    request: string;
    code: string;
    followup: Array<string>;
    text: string;
    JSON: object;
    image: string;
    error: string;
    agent: string;
};

export type Group = {
    name: string;
    files: Array<string>
};