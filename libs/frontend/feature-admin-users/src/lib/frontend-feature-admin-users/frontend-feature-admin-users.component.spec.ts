import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendFeatureAdminUsersComponent } from './frontend-feature-admin-users.component';

describe('FrontendFeatureAdminUsersComponent', () => {
  let component: FrontendFeatureAdminUsersComponent;
  let fixture: ComponentFixture<FrontendFeatureAdminUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontendFeatureAdminUsersComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontendFeatureAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
