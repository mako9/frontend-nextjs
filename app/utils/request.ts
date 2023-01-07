import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from '../../pages/api/auth/[...nextauth]';

export async function request<Type>(url: string, context): Promise<HttpResponse<Type>> {
    const accessToken = await getAccessToken(context);
    if (!accessToken) {
        return {
            data: null,
            statusCode: 401,
            errorMessage: 'Missing access token'
        }
    }
    var headers = getRequestHeaders(accessToken);
    var result = await httpRequest<Type>(url, headers);
    if (result.statusCode !== 401) {
        
    };
    return result;
}

async function httpRequest<Type>(url: string, headers): Promise<HttpResponse<Type>> {
    const res = await fetch(url, {
        headers: headers
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

async function getAccessToken(context) {
    const session = context ?
        await unstable_getServerSession(context.req, context.res, authOptions)
        : await getSession();
    return session ? session.accessToken : null;
}

export type HttpResponse<Type> = {
    data: Type;
    statusCode: number;
    errorMessage: string;
};