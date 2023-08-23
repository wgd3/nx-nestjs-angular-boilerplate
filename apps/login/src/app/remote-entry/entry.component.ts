import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '@libs/frontend/data-access-user';
import { PASSWORD_MIN_LENGTH } from '@libs/shared/util-constants';
import { IUserLogin } from '@libs/shared/util-types';

type LoginFormType = Record<keyof IUserLogin, FormControl<string>>;

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'nx-nestjs-angular-boilerplate-login-entry',
  templateUrl: `entry.component.html`,
  providers: [],
})
export class RemoteEntryComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  authState$ = this.userService.authState$;

  loginForm = new FormGroup<LoginFormType>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
      ],
      updateOn: 'blur',
    }),
  });

  get fEmail(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get fPassword(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  // TODO add login logic
  login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.userService
        .loginUser({ ...this.loginForm.getRawValue() })
        .subscribe({
          next: () => {
            const redirectUrl =
              this.route.snapshot.queryParamMap.get('redirectUrl');
            if (redirectUrl) {
              this.router.navigate([redirectUrl]);
            } else {
              this.router.navigate(['/']);
            }
          },
        });
    } else {
      alert(`Form is invalid!`);
    }
  }
}
