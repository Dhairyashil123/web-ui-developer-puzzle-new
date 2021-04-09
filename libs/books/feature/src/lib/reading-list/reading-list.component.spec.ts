import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getReadingList, removeFromReadingList, finishFromReadingList } from '@tmo/books/data-access';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch action removeFromReadingList', () => {
    const book = createReadingListItem('A');
    component.removeFromReadingList(book);
    expect(dispatchSpy).toHaveBeenCalledWith(removeFromReadingList({item: book}));
  });

  it('should dispatch action finishFromReadingList', () => {
    const book = createReadingListItem('A');
    component.markAsFinish(book);
    expect(dispatchSpy).toHaveBeenCalledWith(finishFromReadingList({item: book}));
  });
});
