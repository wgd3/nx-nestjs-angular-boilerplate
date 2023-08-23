import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { REDIRECT_URL_QUERY_PARAM } from '@libs/frontend/data-access-common';
import { UserService } from '@libs/frontend/data-access-user';
import { PASSWORD_MIN_LENGTH } from '@libs/shared/util-constants';
import { IUserLogin } from '@libs/shared/util-types';

type LoginFormType = Record<keyof IUserLogin, FormControl<string>>;

@Component({
  selector: 'nx-nestjs-angular-boilerplate-frontend-feature-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './frontend-feature-login.component.html',
  styleUrls: ['./frontend-feature-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontendFeatureLoginComponent {
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
            const redirectUrl = this.route.snapshot.queryParamMap.get(
              REDIRECT_URL_QUERY_PARAM
            );
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
