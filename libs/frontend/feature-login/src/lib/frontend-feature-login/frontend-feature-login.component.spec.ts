import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrontendFeatureLoginComponent } from './frontend-feature-login.component';

describe('FrontendFeatureLoginComponent', () => {
  let component: FrontendFeatureLoginComponent;
  let fixture: ComponentFixture<FrontendFeatureLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontendFeatureLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontendFeatureLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
