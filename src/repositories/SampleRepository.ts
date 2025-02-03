import { Entity } from './types/entities/Entity';
import { CreatedResponse } from '@/repositories/types/responses/CreatedResponse';
import {
    BaseRepository,
    type AuthRepoMethodPostRequestOptions,
} from './BaseRepository';
import type { CreateSample } from './types/postBodies/CreateSample';

export interface CreateSampleOptions extends AuthRepoMethodPostRequestOptions<CreateSample> {
    orgId: string;
}

export class SampleRepository extends BaseRepository {
    async createSample(options: CreateSampleOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/projects`;

        const response = await this.postRequest<CreatedResponse, CreateSample>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }
}
