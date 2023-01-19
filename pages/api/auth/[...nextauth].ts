import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url =
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
      
      const formParams = new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })
    

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: formParams
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    KeycloakProvider({
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
        issuer: process.env.KEYCLOAK_ISSUER
      })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.exp) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token.error) {
        session.accessToken = null
        session.user = null
        session.status = 'unauthenticated'
        session.error = token.error
      } else {
        session.user = token.user
        session.accessToken = token.accessToken
        session.status = 'authenticated'
      }

      return session
    },
  },
  events: {
    signOut: async (req, res) => {
      const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
      const result = await fetch(url);
      console.log(`User logged out with status: ${result.status}`);
    },
  } 
}
export default NextAuth(authOptions)