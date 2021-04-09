import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
    });

    it('confirmedMarkBookAsFinished should update book details in the reading list', () => {
      const updatedItem = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: '2021-03-03T00:00:00.000Z'
      };
      const action = ReadingListActions.confirmedFinished({
        item: updatedItem
      });
      const result: State = reducer(state, action);
      expect(result.entities['A']).toEqual(updatedItem);
    });

    it('failedMarkBookAsFinished should update error state', () => {
      const action = ReadingListActions.failedFinished({
        error: 'some error'
      });
      const result: State = reducer(state, action);
      expect(result.error).toEqual('some error');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
