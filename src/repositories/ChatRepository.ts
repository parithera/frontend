import { Entity } from './types/entities/Entity';
import { BaseRepository, type AuthRepoMethodPostRequestOptions } from './BaseRepository';
import { DataResponse } from './types/responses/DataResponse';

export interface AskGPTRequestOptions extends AuthRepoMethodPostRequestOptions<AskGPT> {}

export interface AskGPT {
    request: string;
    userId: string;
    projectId: string;
    organizationId: string;
}

export type ChartData = {
    // data: {
    //     x: any;
    //     y: any;
    //     color: string;
    // }[];
    // params: {
    //     x_name: string;
    //     y_name: string;
    //     title: string;
    //     colors: string[];
    // };
    answer: string;
    type: string;
};

export class ChatRepository extends BaseRepository {
    async askGPT(options: AskGPTRequestOptions): Promise<DataResponse<ChartData>> {
        const RELATIVE_URL = `/gpt/ask`;

        const response = await this.postRequest<DataResponse<ChartData>, AskGPT>({
            data: options.data,
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<ChartData>>(response, DataResponse<ChartData>);
    }
}
