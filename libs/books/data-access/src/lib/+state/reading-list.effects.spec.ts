import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { API_ENDPOINTS } from './book.constant';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, NoopAnimationsModule, MatSnackBarModule ],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    matSnackBar = TestBed.inject(MatSnackBar);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(API_ENDPOINTS.LIST).flush([]);
    });
  });

  describe('removeBook$', () => {
    it('should call API to remove book and show snackBar and undo remove book', (done) => {
      actions = new ReplaySubject();
      const item = createReadingListItem('A');
      actions.next(
        ReadingListActions.removeFromReadingList({ item })
      );

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );
        expect(matSnackBar._openedSnackBarRef).not.toBeNull();
        matSnackBar._openedSnackBarRef.dismissWithAction();
        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.addToReadingList({
            book: createBook('A')
          })
        );
        done();
      });

      httpMock.expectOne(`${API_ENDPOINTS.LIST}/A`).flush(null);
    });
  });

  describe('addBook$', () => {
    it('should call API to add book and show snackBar and undo add book', (done) => {
      actions = new ReplaySubject();
      const book = createBook('A');
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        expect(matSnackBar._openedSnackBarRef).not.toBeNull();
        matSnackBar._openedSnackBarRef.dismissWithAction();
        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.removeFromReadingList({
            item: createReadingListItem('A')
          })
        );
        done();
      });

      httpMock.expectOne(API_ENDPOINTS.LIST).flush(null);
    });
  });
});
