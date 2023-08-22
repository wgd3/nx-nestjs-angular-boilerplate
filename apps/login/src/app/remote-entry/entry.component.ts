import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_MIN_LENGTH } from '@libs/shared/util-constants';
import { IUserLogin } from '@libs/shared/util-types';

type LoginFormType = Record<keyof IUserLogin, FormControl<string>>;

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'nx-nestjs-angular-boilerplate-login-entry',
  templateUrl: `entry.component.html`,
})
export class RemoteEntryComponent {
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
      console.log(`Logged In!`);
    } else {
      alert(`Form is invalid!`);
    }
  }
}
