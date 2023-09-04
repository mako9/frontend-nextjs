import { Session } from "next-auth";
import logger from "./logger";

export async function request<Type>(
    url: string,
    session: Session,
    method: HttpMethod = HttpMethod.Get,
    data: any = null,
    contentType: MimeType = MimeType.json,
    accept: MimeType = MimeType.json
): Promise<HttpResponse<Type>> {
    const accessToken = await getAccessToken(session);
    if (!accessToken) {
        if (session) session.accessToken = '';
        logger.info(`REQUEST: ${url} | Missing access token`);
        return {
            data: null,
            statusCode: 401,
            errorMessage: 'Missing access token'
        }
    }
    var result = await httpRequest<Type>(url, contentType, accept, accessToken, method, data);
    if (result.statusCode === 401) {
        if (session) session.accessToken = '';
    };
    return result;
}

async function httpRequest<Type>(
    url: string,
    contentType: MimeType,
    accept: MimeType,
    accessToken: String,
    method: HttpMethod,
    data
): Promise<HttpResponse<Type>> {
    var headers = getRequestHeaders(accessToken, contentType, accept);
    var body = getRequestBody(data, contentType)
    logger.debug(`REQUEST: ${method} ${url} | Headers: ${headers} | Body: ${body}`);
    const res = await fetch(url, {
        headers: headers,
        method: method,
        body: body,
        mode: 'cors'
    });
    if (!res.ok) {
        var bodyString = res.statusText;
        try {
            const jsonResponse = await res.json();
            bodyString = JSON.stringify(jsonResponse)
        } catch (err) {
            logger.debug('Could not parse response body:', err)
        }
        logger.info(`RESPONSE: Status ${res.status} | Body: ${bodyString}`);
        return {
            data: null,
            statusCode: res.status,
            errorMessage: res.statusText
        }
    };
    try {
        const data = await getData<Type>(res, accept);
        return {
            data: data,
            statusCode: res.status,
            errorMessage: null
        }
    } catch (error) {
        logger.error(`RESPONSE: Status ${res.status} | Body: ${res.body} | Error: ${error}`);
        return {
            data: null,
            statusCode: res.status,
            errorMessage: error.message
        };
    }
}

export function clientSideRequest(originalFunction, state, setState) {
    return async function(...args: any) {
        setState({ ...state, isLoading: true });
        const result = await originalFunction(...args);
        setState({ ...state, isLoading: false });
        return result;
      }
}

function getRequestHeaders(token: String, contentType: MimeType, accept: MimeType) {
    const headers = {
        'Authorization': `Bearer ${token}`
    }
    // when sending a form with `fetch` in browser, don't set Content-Type header, because browser sets it automatically with correct 'boundary'.
    if (contentType && contentType !== MimeType.formData) {
        headers['Content-Type'] = contentType;
    }
    if (accept) {
        headers['Accept'] = accept;
    }
    return headers;
}

function getRequestBody(data, contentType: MimeType) {
    if (data == null) {
        return null;
    }
    switch (contentType) {
        case MimeType.formData:
            const formData = new FormData();
            formData.append('file', data);
            formData.append('fileName', 'test');
            return formData;
        case MimeType.json:
            return JSON.stringify(data);
        default:
            return data;
    }
}

async function getData<Type>(response: Response, accept: MimeType): Promise<Type> {
    switch (accept) {
        case MimeType.octetStream:
            return response.blob() as Type;
        case MimeType.json:
            return await response.json() as Type;
        default:
            return response.body as Type;
    }
}

async function getAccessToken(session): Promise<String> {
    return session ? session.accessToken : null;
}

export type HttpResponse<Type> = {
    data: Type | null;
    statusCode: number;
    errorMessage: string | null;
};

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Put = 'PUT',
    Delete = 'DELETE'
  }

export enum MimeType {
    json = 'application/json',
    formData = 'multipart/form-data',
    octetStream = 'application/octet-stream',
    textPlain = 'text/plain'
}