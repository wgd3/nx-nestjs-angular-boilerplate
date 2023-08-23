import * as jwtDecode from 'jwt-decode';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AccessToken,
  ICreateUser,
  IJwtPayload,
  ITokenResponse,
  IUpdateUser,
  IUser,
  IUserLogin,
  RefreshToken,
} from '@libs/shared/util-types';

import {
  LOCAL_STORAGE_KEY_ACCESS_TOKEN,
  LOCAL_STORAGE_KEY_REFRESH_TOKEN,
} from './constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private _accessToken: AccessToken | null = null;
  private _refreshToken: RefreshToken | null = null;

  private userData$$ = new BehaviorSubject<IJwtPayload | null>(null);

  authState$ = this.userData$$.asObservable();
  isLoggedIn$ = this.authState$.pipe(map((data) => !!data));

  constructor() {
    this.accessToken = localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
    this.refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY_REFRESH_TOKEN);
  }

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

  get tokenExpired(): boolean {
    if (!this.accessToken) {
      return true;
    }

    const expiryTime = this.userData$$.value?.exp;
    if (expiryTime) {
      const expireTs = 1000 * +expiryTime;
      const now = new Date().getTime();
      console.log(
        `[AuthService] Time left to expiration: ${Math.round(
          (expireTs - now) / 1000,
        )} seconds`,
      );
      return expireTs - now <= 0;
    }
    return true;
  }

  loginUser(dto: IUserLogin): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`/api/v1/auth/email/login`, dto).pipe(
      tap((tokens) => {
        console.log(`Got Tokens!`, tokens);
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      }),
    );
  }

  logoutUser() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  addUser(user: ICreateUser): Observable<IUser> {
    return this.http
      .post<IUser>(`/api/v1/auth/email/register`, user)
      .pipe(tap((user) => console.log(`User created successfully!`, user)));
  }

  editUser(userId: string, user: IUpdateUser) {
    return this.http
      .patch<IUser>(`/api/v1/users/${userId}`, user)
      .pipe(tap((user) => console.log(`User updated successfully`, user)));
  }
}
