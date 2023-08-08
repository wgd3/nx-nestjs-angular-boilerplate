/**
 * Represents the API response when logging in with email/password
 */
export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}
