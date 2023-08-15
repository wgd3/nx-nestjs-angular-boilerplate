import { IBaseEmailContext } from './layout.email-context';

export interface IResetPasswordEmailContext extends IBaseEmailContext {
  passwordResetLink: string;
}
