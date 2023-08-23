import { map, tap } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Type,
} from '@angular/core';
import { UserService } from '@libs/frontend/data-access-user';
import { UpsertDialogData } from '@libs/frontend/util-common';
import {
  ICreateUser,
  IPaginatedResponse,
  IUpdateUser,
  IUser,
} from '@libs/shared/util-types';
import { DialogRef, DialogService } from '@ngneat/dialog';
import {
  errorTailorImports,
  provideErrorTailorConfig,
} from '@ngneat/error-tailor';
import { HotToastModule } from '@ngneat/hot-toast';
import { createAsyncStore } from '@ngneat/loadoff';

import { UserUpsertDialogComponent } from '../user-upsert-dialog/user-upsert-dialog.component';

@Component({
  selector: 'nx-nestjs-angular-boilerplate-frontend-feature-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    UserUpsertDialogComponent,
    HotToastModule,
    errorTailorImports,
  ],
  templateUrl: './frontend-feature-admin-users.component.html',
  styleUrls: ['./frontend-feature-admin-users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideErrorTailorConfig({
      errors: {
        useValue: {
          required: `This field is required!`,
        },
      },
    }),
  ],
})
export class FrontendFeatureAdminUsersComponent implements OnInit {
  private http = inject(HttpClient);
  private dialogService = inject(DialogService);
  private readonly usersService = inject(UserService);

  private dialogRef: DialogRef<UpsertDialogData<IUser>> | undefined;

  store = createAsyncStore<IUser[]>();
  users$ = this.store.value$.pipe(map((state) => state.res));

  ngOnInit() {
    this.refreshUsers();
  }

  openUpsertUserDialog(
    action: UpsertDialogData<IUser>['action'],
    currentValue?: UpsertDialogData<IUser>['currentValue'],
  ) {
    // TODO - find out why this has to be manually cast instead of `open()`
    // accepting the component
    this.dialogRef = this.dialogService.open(
      UserUpsertDialogComponent as Type<unknown>,
      {
        data: {
          action,
          currentValue,
          actions$: {
            add: (user: ICreateUser) => this.usersService.addUser(user),
            edit: (user: IUpdateUser, userId: string) =>
              this.usersService.editUser(userId, user).pipe(
                tap(() => this.refreshUsers()),
                // catchError((err) => {
                //   if (err instanceof HttpErrorResponse) {
                //     if (err.status >= 400) {
                //       this.dialogRef?.data.error = err.error.message
                //     }
                //   }
                // })
              ),
          },
        },
      },
    );
  }

  private refreshUsers() {
    this.http
      .get<IPaginatedResponse<IUser>>(`/api/v1/users?perPage=50`)
      .pipe(
        map(({ data }) => data),
        this.store.track(),
      )
      .subscribe();
  }
}
