import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailViewComponent } from './movie-detail-view.component';

describe('MovieDetailViewComponent', () => {
  let component: MovieDetailViewComponent;
  let fixture: ComponentFixture<MovieDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
