import { AdammathPage } from './app.po';

describe('adammath App', () => {
  let page: AdammathPage;

  beforeEach(() => {
    page = new AdammathPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
