import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuardGuard } from './auth-guard.guard';

describe('authGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
