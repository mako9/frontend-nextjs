import { Session } from "next-auth";

export async function request<Type>(url: string, session: Session, method: HttpMethod = HttpMethod.Get, body = null): Promise<HttpResponse<Type>> {
    const accessToken = await getAccessToken(session);
    if (!accessToken) {
        if (session) session.accessToken = null;
        return {
            data: null,
            statusCode: 401,
            errorMessage: 'Missing access token'
        }
    }
    var headers = getRequestHeaders(accessToken);
    var result = await httpRequest<Type>(url, headers, method, body);
    if (result.statusCode === 401) {
        if (session) session.accessToken = null;
    };
    return result;
}

async function httpRequest<Type>(url: string, headers, method: HttpMethod, body): Promise<HttpResponse<Type>> {
    var json = body ? JSON.stringify(body) : null;
    const res = await fetch(url, {
        headers: headers,
        method: method,
        body: json
    });
    if (!res.ok) {
        return {
            data: null,
            statusCode: res.status,
            errorMessage: res.statusText
        }
    };
    console.log(res.body);
    try {
        const result = await res.json() as Type;
        return {
            data: result,
            statusCode: res.status,
            errorMessage: null
        }
    } catch (error) {
        console.error(error);
        return {
            data: null,
            statusCode: res.status,
            errorMessage: error.message
        };
    }
}

function getRequestHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function getAccessToken(session): Promise<String> {
    return session ? session.accessToken : null;
}

export type HttpResponse<Type> = {
    data: Type;
    statusCode: number;
    errorMessage: string;
};

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Put = 'PUT',
    Delete = 'DELETE'
  }