import { BehaviorSubject, map } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { IPaginatedResponse, IUser } from '@libs/shared/util-types';

@Component({
  selector: 'nx-nestjs-angular-boilerplate-frontend-feature-admin-users',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './frontend-feature-admin-users.component.html',
  styleUrls: ['./frontend-feature-admin-users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontendFeatureAdminUsersComponent implements OnInit {
  private http = inject(HttpClient);

  private users$$ = new BehaviorSubject<IUser[]>([]);
  users$ = this.users$$.asObservable();

  ngOnInit() {
    this.http
      .get<IPaginatedResponse<IUser>>(`/api/v1/users?perPage=50`)
      .pipe(map(({ data }) => data))
      .subscribe((users) => this.users$$.next(users));
  }
}
