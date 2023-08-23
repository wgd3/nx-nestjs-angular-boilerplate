import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  UpsertDialogComponent,
  UpsertDialogDataActionType,
} from '@libs/frontend/util-common';
import { IUpdateUser, IUser, RoleType } from '@libs/shared/util-types';
import { DialogCloseDirective } from '@ngneat/dialog';
import {
  errorTailorImports,
  provideErrorTailorConfig,
} from '@ngneat/error-tailor';

type EditUserFormType = {
  [key in keyof IUpdateUser]: FormControl<IUpdateUser[key]>;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'admin-user-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    errorTailorImports,
    DialogCloseDirective,
  ],
  templateUrl: './user-upsert-dialog.component.html',
  styleUrls: ['./user-upsert-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideErrorTailorConfig({})],
})
export class UserUpsertDialogComponent extends UpsertDialogComponent<IUser> {
  form = inject(FormBuilder).nonNullable.group<EditUserFormType>({
    avatar: new FormControl<string | null>(null),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    role: new FormControl<RoleType>(RoleType.USER, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  override getMessages(): Record<UpsertDialogDataActionType, string> {
    return {
      add: `User was added successfully!`,
      edit: `User was edited successfully`,
    };
  }
}
