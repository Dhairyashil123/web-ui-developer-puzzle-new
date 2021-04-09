import { $, browser, ExpectedConditions, $$ } from 'protractor';

async function addItemToReadingList() {
  const items = await $$('[data-testing="book-item"]');
  const child = items[0].$('button');
  await child.click();
}

async function removeItemFromReadingList() {
  const readingItems = await $$('[data-testing="reading-list-item"]');
  const removeButton = readingItems[0].$('[data-testing="remove-btn"]');
  await removeButton.click();
}

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('should mark book as read', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // submit search books form
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();
    // check if books are displayed on page
    let items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(0);

    await addItemToReadingList();

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

    // mark book as finished
    const readingItems = await $$('[data-testing="reading-list-item"]');
    const markAsFinishedBtn = readingItems[0].$(
      '[data-testing="mark-finished-btn"]'
    );
    expect(markAsFinishedBtn).toBeTruthy();
    await markAsFinishedBtn.click();

    // check if book is marked as finished
    const finishedBtn = readingItems[0].$('[data-testing="finished-btn"]');
    expect(finishedBtn).toBeTruthy();

    const finishedDate = readingItems[0].$('[data-testing="finished-date"]');
    expect(finishedDate).toBeTruthy();

    // check button text for book search list item after marking book as finished
    items = await $$('[data-testing="book-item"]');
    let child = items[0].$('button');
    expect(child.getText()).toEqual('Finished');

    await removeItemFromReadingList();

    // check button text for book search list item after removing book from reading list
    items = await $$('[data-testing="book-item"]');
    child = items[0].$('button');
    expect(child.getText()).toEqual('Want to Read');
  });
});
