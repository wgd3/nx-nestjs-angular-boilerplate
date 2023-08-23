import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserUpsertDialogComponent } from './user-upsert-dialog.component';

describe('UserUpsertDialogComponent', () => {
  let component: UserUpsertDialogComponent;
  let fixture: ComponentFixture<UserUpsertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpsertDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserUpsertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
