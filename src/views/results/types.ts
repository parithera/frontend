export type ChatContent = {
    request: string;
    code: string;
    followup: Array<string>;
    text: string;
    JSON: object;
    image: string;
    error: string;
    status: string,
    agent: string;
};

export type Group = {
    name: string;
    files: Array<string>
};

export type SampleElement = {
    name: string;
    id: string
}