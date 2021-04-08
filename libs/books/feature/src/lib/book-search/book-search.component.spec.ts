import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, searchBooks } from '@tmo/books/data-access';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should trigger action addToReadingList', () => {
    const book = createBook('A');
    component.addBookToReadingList(book);
    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({book}));
  });

  it('should trigger action searchBooks', () => {
    component.searchForm.value.term = 'Java';
    const book = createBook('A');
    component.searchBooks();
    expect(dispatchSpy).toHaveBeenCalledWith(searchBooks({term: 'Java'}));
  });
});
