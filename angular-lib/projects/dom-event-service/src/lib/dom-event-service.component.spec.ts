import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomEventServiceComponent } from './dom-event-service.component';

describe('DomEventServiceComponent', () => {
  let component: DomEventServiceComponent;
  let fixture: ComponentFixture<DomEventServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomEventServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomEventServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
