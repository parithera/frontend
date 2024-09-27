import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { APIErrors } from './types/errors/ApiErrors';
import router from '@/router';
import type { UploadData } from './FileRepository';

/**
 * @class BaseRepository
 *
 * @classdesc
 * A base class for respository classes that abstracts access to API calls.
 *
 */
export class BaseRepository {
    private BASE_URL: string;
    private toast: any;

    constructor() {
        this.BASE_URL = `https://${window.location.hostname}/${import.meta.env.VITE_API_URL}`;
        this.toast = useToast();
    }

    /**
     * @returns {string} - BASE API Url
     */
    private getBaseUrl() {
        return this.BASE_URL;
    }

    /**
     * Attach query params
     * @param {QueryParams|undefined} queryParams Query paramaters
     */
    private attachSearchParams(searchParams: URLSearchParams, queryParams?: QueryParams) {
        if (queryParams) {
            for (const [key, value] of Object.entries(queryParams)) {
                if (Array.isArray(value)) {
                    value.forEach((value) => searchParams.append(key, value.toString()));
                } else {
                    if (value != undefined) {
                        searchParams.append(key, value.toString());
                    }
                }
            }
        }
    }

    /**
     * Builds an absolute URL that points to the API.
     *
     * @param {string} relativeUrl - Endpoint url
     * @returns {string} - URL of the endpoint
     */
    protected buildUrl(relativeUrl: string) {
        if (relativeUrl.substring(0, 1) == '/') return `${this.getBaseUrl()}${relativeUrl}`;
        else return `${this.getBaseUrl()}/${relativeUrl}`;
    }

    /**
     * Get Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async getRequest<R>(options: GetRequestOptions): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        // Construct fetch options
        const fetchOptions: any = {
            method: 'GET',
            headers: headers
        };

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);

        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * Post Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {any|undefined} options.data the post body
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async postRequest<R, P>(options: PostRequestOptions<P>): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        headers.append('Content-Type', 'application/json');

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        // Construct fetch options
        const fetchOptions: any = {
            method: 'POST',
            headers: headers
        };

        if (options.data) {
            fetchOptions['body'] = JSON.stringify(options.data);
        }

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * Delete Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async deleteRequest<R, P>(options: DeleteRequestOptions<P>): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        headers.append('Content-Type', 'application/json');

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        // Construct fetch options
        const fetchOptions: any = {
            method: 'DELETE',
            headers: headers
        };

        if (options.data) {
            fetchOptions['body'] = JSON.stringify(options.data);
        }

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * PUT Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {any|undefined} options.data the put body
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async putRequest<R, P>(options: PutRequestOptions<P>): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        headers.append('Content-Type', 'application/json');

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        // Construct fetch options
        const fetchOptions: any = {
            method: 'PUT',
            headers: headers
        };

        if (options.data) {
            fetchOptions['body'] = JSON.stringify(options.data);
        }

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * Patch Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {any|undefined} options.data the patch body
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async patchRequest<R, P>(options: PatchRequestOptions<P>): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        headers.append('Content-Type', 'application/json');

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        // Construct fetch options
        const fetchOptions: any = {
            method: 'PATCH',
            headers: headers
        };

        if (options.data) {
            fetchOptions['body'] = JSON.stringify(options.data);
        }

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * Patch Request.
     *
     * @param {GetRequestOptions} options Get request options
     * @param {string} options.url url
     * @param {QueryParams|undefined} options.queryParams object that contains all the query params using key/value pairs
     * @param {any|undefined} options.data the patch body
     * @param {function(T)|undefined} options.success callback on success
     * @param {function()|undefined} options.finalize callback on when request is finished (both on success and error)
     * @param {function(BusinessLogicError)|undefined} [options.businessLogicError=this.defaultBusinessErrorHandler] callback on business logic errors (api errors). Default: defaultBusinessErrorHandler.
     * @param {function(HttpError)|undefined} [options.httpError=this.defaultHttpErrorHandler] callback on http errors (protocol errors). Default: defaultHttpErrorHandler.
     * @param {function(any)|undefined} [options.error=this.defaultErrorHandler] callback on network and marshalling/unmarshalling errors. Default: defaultErrorHandler.
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    protected async fileRequest<R, P>(options: PatchRequestOptions<P>): Promise<R> {
        // Construct the url, including query parameters
        const url = new URL(options.url);
        this.attachSearchParams(url.searchParams, options.queryParams);

        // Construct headers
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        // headers.append('Content-Type', 'multipart/form-data');

        // Attach bearer token
        if (options.bearerToken) {
            headers.append('Authorization', `Bearer ${options.bearerToken}`);
        }

        // Attach additional headers
        if (options.headers) {
            for (const header of options.headers) {
                headers.append(header[0], header[1]);
            }
        }

        const formData = new FormData();

        const data: UploadData = options.data as object as UploadData;
        formData.append('file', data.file, data.file.name);
        formData.append('type', data.type);
        formData.append('file_name', data.file_name);

        // Construct fetch options
        const fetchOptions: any = {
            method: 'PATCH',
            headers: headers,
            body: formData
        };

        // Send the request
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();

        // Check the response
        if (response.ok) {
            // Status code 2xx
            return result;
        } else {
            // Status code 1xx, 3xx, 4xx, 5xx
            const error = this.errorHandler({
                request: {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: result
                },
                handleBusinessErrors: options.handleBusinessErrors,
                handleHTTPErrors: options.handleHTTPErrors,
                defaultBusinessLogicErrorHandlerTextPrefix:
                    options.defaultBusinessLogicErrorHandlerTextPrefix
            });
            throw error;
        }
    }

    /**
     * Error parser for a failed API request.
     *
     * @param {Object} options - Options
     * @param {Object} options.request - Request Objects
     * @param {Object} options.request.xhr - jqXHR object
     * @param {string} options.request.error -  When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
     * @param {Object} options.handleBusinessErrors - Options
     * @param {Object} options.handleHTTPErrors - Options
     * @param {string} options.defaultBusinessLogicErrorHandlerTextPrefix In case you want the default business error handler to handle the error but you wish to add some defined prefix to the error message it shows to users.
     */
    private errorHandler(options: ErrorHandlerOptions) {
        const status = options.request.status;
        const statusText = options.request.statusText;
        const responseBody = options.request.responseBody;

        if (responseBody != undefined && 'error_code' in responseBody) {
            if (responseBody['error_code'] == APIErrors.NotAuthenticated) {
                router.push('/login');
            }
        }

        if (responseBody != undefined && 'error_code' in responseBody) {
            let business_logic_error = new BusinessLogicError(
                responseBody['error_code'],
                responseBody['error_message']
            );

            if (business_logic_error.error_code == APIErrors.ValidationFailed) {
                business_logic_error = new ValidationError(
                    responseBody['error_code'],
                    responseBody['error_message'],
                    responseBody['validation_errors']
                );
            }

            if (options.handleBusinessErrors != undefined && options.handleBusinessErrors == true) {
                throw business_logic_error;
            } else {
                this.defaultBusinessErrorHandler(
                    business_logic_error,
                    options.defaultBusinessLogicErrorHandlerTextPrefix
                );
                throw business_logic_error;
            }
        } else {
            const http_error = new HttpError(status, statusText);
            if (options.handleHTTPErrors != undefined && options.handleHTTPErrors == true) {
                throw http_error;
            } else {
                this.defaultHttpErrorHandler(http_error);
                throw http_error;
            }
        }
    }

    /**
     * Default business error handler that runs in case no business error handler was supplied by the user.
     */
    private async defaultBusinessErrorHandler(
        business_logic_error: BusinessLogicError,
        defaultBusinessLogicErrorHandlerTextPrefix?: string
    ) {
        let prefix = 'An error occured during the processing of the request.';
        if (defaultBusinessLogicErrorHandlerTextPrefix != undefined) {
            prefix = defaultBusinessLogicErrorHandlerTextPrefix;
        }
        this.toast.error(
            `${prefix} ErrorCode: ${business_logic_error.error_code}. Reason: ${business_logic_error.error_message}`,
            { position: 'bottom-right' }
        );
    }

    /**
     * Default http error handler that runs in case no http error handler was supplied by the user.
     */
    private async defaultHttpErrorHandler(http_error: HttpError) {
        console.error(http_error);
        this.toast.error('Request failed to be processed. Please reload the page and try again.', {
            position: 'bottom-right'
        });
    }
}

/**
 * Object that represents a Business Logic Error from a API Call
 * @name BusinessLogicError
 *
 * @typedef {Object} BusinessLogicError
 *
 * @property {string} error_code - API Error Name
 * @property {string} error_message - API Error elaboration message
 *
 * @param {string} error_code - API Error Name
 * @param {string} error_message - API Error elaboration message
 */
export class BusinessLogicError {
    error_code: string;
    error_message: string;

    constructor(error_code: string, error_message: string /* mitigation: any*/) {
        this.error_code = error_code;
        this.error_message = error_message;
    }
}

interface _ValidationError {
    property: string;
    errors: string[];
}

export class ValidationError extends BusinessLogicError {
    validation_errors: _ValidationError[];

    constructor(
        error_code: string,
        error_message: string,
        validation_errors: _ValidationError[] /* mitigation: any*/
    ) {
        super(error_code, error_message);
        this.validation_errors = validation_errors;
    }

    toMessage(prefix: string): string {
        let message = `${prefix}\n`;
        for (const validationError of this.validation_errors) {
            for (const error of validationError.errors) {
                message += `  - ${error}\n`;
            }
        }
        return message;
    }
}

/**
 * Object that represents a HTTP Error from a API Call
 * @name HttpError
 *
 * @typedef {Object} HttpError
 *
 * @property {string} code - HTTP status code.
 * @property {string} status - When an HTTP error occurs, status receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
 *
 * @param {string} code - HTTP status code.
 * @param {string} status - When an HTTP error occurs, status receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
 */
export class HttpError {
    code: any;
    status: any;

    constructor(code: any, status: any) {
        this.code = code;
        this.status = status;
    }
}

type QueryParams = { [key: string]: string | number | undefined | string[] | number[] };

interface RequestOptions {
    url: string;
    headers?: Headers;
    bearerToken?: string;
    queryParams?: QueryParams;
    handleBusinessErrors?: boolean;
    handleHTTPErrors?: boolean;
    handleOtherErrors?: boolean;
    defaultBusinessLogicErrorHandlerTextPrefix?: string;
}

interface GetRequestOptions extends RequestOptions {}
interface PostRequestOptions<P> extends RequestOptions {
    data: P;
}
interface DeleteRequestOptions<P> extends RequestOptions {
    data: P;
}
interface PutRequestOptions<P> extends RequestOptions {
    data: P;
}
interface PatchRequestOptions<P> extends RequestOptions {
    data: P;
}

interface ErrorHandlerOptions {
    request: {
        status: number;
        statusText: string;
        responseBody: any;
    };
    handleBusinessErrors?: boolean;
    handleHTTPErrors?: boolean;
    defaultBusinessLogicErrorHandlerTextPrefix?: string;
}

export interface RepoMethodOptions {
    headers?: Headers;
    queryParams?: QueryParams;
    handleBusinessErrors?: boolean;
    handleHTTPErrors?: boolean;
    handleOtherErrors?: boolean;
    defaultBusinessLogicErrorHandlerTextPrefix?: string;
}

export interface AuthenticatedRepoMethodOptions extends RepoMethodOptions {
    bearerToken: string;
}

export interface RepoMethodGetRequestOptions extends RepoMethodOptions {}
export interface RepoMethodPostRequestOptions<P> extends RepoMethodOptions {
    data: P;
}
export interface RepoMethodEmptyPostRequestOptions extends RepoMethodOptions {}
export interface RepoMethodDeleteRequestOptions extends RepoMethodOptions {}
export interface RepoMethodPutRequestOptions<P> extends RepoMethodOptions {
    data: P;
}
export interface RepoMethodPatchRequestOptions<P> extends RepoMethodOptions {
    data: P;
}

export interface RepoMethodEmptyPatchRequestOptions<P> extends AuthenticatedRepoMethodOptions {
    data: P;
}
export interface AuthRepoMethodGetRequestOptions extends AuthenticatedRepoMethodOptions {}
export interface AuthRepoMethodPostRequestOptions<P> extends AuthenticatedRepoMethodOptions {
    data: P;
}
export interface AuthRepoMethodEmptyPostRequestOptions extends AuthenticatedRepoMethodOptions {}
export interface AuthRepoMethodEmptyDeleteRequestOptions extends AuthenticatedRepoMethodOptions {}
export interface AuthRepoMethodDeleteRequestOptions<P> extends AuthenticatedRepoMethodOptions {
    data: P;
}
export interface AuthRepoMethodPutRequestOptions<P> extends AuthenticatedRepoMethodOptions {
    data: P;
}
export interface AuthRepoMethodPatchRequestOptions<P> extends AuthenticatedRepoMethodOptions {
    data: P;
}

export interface PaginatedRepoMethodRequestOptions {
    pagination: {
        page: number;
        entries_per_page: number;
    };
}

export interface SearchableRepoMethodRequestOptions {
    search: {
        searchKey: string;
    };
}

export interface SortableRepoMethodRequestOptions {
    sort: {
        sortKey: string;
        sortDirection?: string;
    };
}

export interface EmptyPostData {}
