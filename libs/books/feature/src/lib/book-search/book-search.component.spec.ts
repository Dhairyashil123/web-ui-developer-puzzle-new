import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, searchBooks, clearSearch } from '@tmo/books/data-access';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { BOOK_CONSTANT } from '../book.constant';
import { Subscription } from 'rxjs';

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
    fixture.detectChanges();
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

  it('Should dispatch searchBooks action after 500ms and search team is changed', fakeAsync(() => {
    component.searchForm.setValue({ term: 'java' });
    tick(300);
    expect(dispatchSpy).not.toHaveBeenCalled();
    component.searchForm.setValue({ term: 'javac' });
    tick(500);
    expect(dispatchSpy).toHaveBeenCalledWith(searchBooks({ term: 'javac' }));
  }));

  it('Should not dispatch searchBooks action when search term is not changed after 500ms', fakeAsync(() => {
    component.searchForm.setValue({ term: 'javascrip' });
    tick(500);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, searchBooks({ term: 'javascrip' }));
    component.searchForm.setValue({ term: 'javascr' });
    component.searchForm.setValue({ term: 'javascrip' });
    tick(500);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, searchBooks({ term: 'javascrip' }));
  }));

  it('should dispatch clearSearch when search term is empty and changed', fakeAsync(() => {
    component.searchForm.setValue({ term: BOOK_CONSTANT.EMPTY_STRING });
    tick(500);
    expect(dispatchSpy).toHaveBeenCalledWith(clearSearch());
  }));

  it('should unsubscibe subscription on ngOnDestroy',() => {
    component.subscription$ = new Subscription();
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalled();
  });
});
