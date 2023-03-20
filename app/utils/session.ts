import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export async function getServerSideSession(context): Promise<Session> {
    return await getServerSession(context.req, context.res, authOptions)
}