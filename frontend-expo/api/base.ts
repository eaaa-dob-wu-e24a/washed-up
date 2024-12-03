export class ApiBase {
  protected accessToken: unknown | undefined;
  protected baseUrl = process.env.EXPO_PUBLIC_API_URL;

  constructor(accessToken?: unknown | undefined) {
    this.accessToken = accessToken;
  }
}
