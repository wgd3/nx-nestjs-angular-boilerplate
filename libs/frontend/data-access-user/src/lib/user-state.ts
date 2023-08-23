import * as jwtDecode from 'jwt-decode';
import { BehaviorSubject, map } from 'rxjs';

import {
  AccessToken,
  IJwtPayload,
  ITokenResponse,
  RefreshToken,
} from '@libs/shared/util-types';

import {
  LOCAL_STORAGE_KEY_ACCESS_TOKEN,
  LOCAL_STORAGE_KEY_REFRESH_TOKEN,
} from './constants';

/**
 * Framework-agnostic class that can be used to store user and auth data
 */
export class UserState {
  /**
   * Whenever a change is made to localStorage, we'll update the subject so
   * subscribers from any client app will be aware. Subjects come from RxJs,
   * which will keep this class framework-agnostic
   */
  //   public stateChanged$ = new Subject();

  private _accessToken: AccessToken | null = null;
  private _refreshToken: RefreshToken | null = null;

  private isLoggedIn$$ = new BehaviorSubject<boolean>(false);
  private userData$$ = new BehaviorSubject<IJwtPayload | null>(null);

  authState$ = this.userData$$.asObservable();
  isLoggedIn$ = this.authState$.pipe(map((data) => !!data));

  get accessToken(): AccessToken | null {
    return this._accessToken;
  }
  set accessToken(val: AccessToken | null) {
    this._accessToken = val;
    localStorage.setItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN, String(val));
    // this could be simplied to using `next()` with a ternary operation
    // based on the value of `val` - but we want to make sure to catch any
    // decoding errors
    if (val) {
      try {
        const data = jwtDecode.default(val) as IJwtPayload;
        this.userData$$.next(data);
      } catch (err) {
        throw new Error(`Error decoding access token: ${err}`);
      }
    } else {
      this.userData$$.next(null);
    }
  }

  get refreshToken(): RefreshToken | null {
    return this._refreshToken;
  }
  set refreshToken(val: RefreshToken | null) {
    this._refreshToken = val;
    localStorage.setItem(LOCAL_STORAGE_KEY_REFRESH_TOKEN, String(val));
  }

  setUser(tokens: ITokenResponse) {
    this.accessToken = tokens.accessToken;
  }
}
