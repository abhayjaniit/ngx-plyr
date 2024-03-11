import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../testing.module';
import { HlsjsComponent } from './hlsjs.component';

describe('HlsjsComponent', () => {
  let component: HlsjsComponent;
  let fixture: ComponentFixture<HlsjsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
      ],
      declarations: [HlsjsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlsjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
