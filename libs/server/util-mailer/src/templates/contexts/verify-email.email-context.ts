import { IBaseEmailContext } from './layout.email-context';

export interface IVerifyEmailContext extends IBaseEmailContext {
  verificationLink: string;
  userEmailAddress: string;
}
