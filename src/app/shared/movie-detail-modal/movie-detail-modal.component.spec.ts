import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailModalComponent } from './movie-detail-modal.component';

describe('MovieDetailModalComponent', () => {
  let component: MovieDetailModalComponent;
  let fixture: ComponentFixture<MovieDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
