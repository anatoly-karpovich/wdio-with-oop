export interface IUserCredentials {
  email: string;
  password: string;
}

export type ILoginResponse = {
  token: string;
};
