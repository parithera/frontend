import { Entity } from './types/entities/Entity';
import {
    BaseRepository,
    type AuthRepoMethodEmptyDeleteRequestOptions,
    type EmptyPostData,
    type RepoMethodEmptyPatchRequestOptions
} from './BaseRepository';
import { NoDataResponse } from './types/responses/NoDataResponse';

export interface UploadRequestOptions extends RepoMethodEmptyPatchRequestOptions<UploadData> {
    projectId: string;
    organizationId: string;
}

export interface UploadData {
    file: File;
    type: string;
    file_name: string;
}

export interface DeleteFileOptions extends AuthRepoMethodEmptyDeleteRequestOptions {
    projectId: string;
    organizationId: string;
    fileId: string;
}

export class FileRepository extends BaseRepository {
    async upload(options: UploadRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/file/${options.projectId}/upload`;

        const response = await this.fileRequest<NoDataResponse, UploadData>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors,
            data: options.data
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async deleteFile(options: DeleteFileOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/file/${options.projectId}/${options.fileId}`;

        const response = await this.deleteRequest<NoDataResponse, EmptyPostData>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors,
            data: {}
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }
}
