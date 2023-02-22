import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export async function getServerSideSession(context): Promise<Session> {
    return await unstable_getServerSession(context.req, context.res, authOptions)
}