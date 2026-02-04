export function buildSearchHtmlFromMock(mock: any, limit = 3): string {
  const itemsHtml = mock.results
    .slice(0, limit)
    .map(
      (item: any) => `
        <li class="ui-search-layout__item">
          <h2>${item.title}</h2>
        </li>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Mocked Search</title>
      </head>
      <body>
        <ol class="ui-search-layout">
          ${itemsHtml}
        </ol>
      </body>
    </html>
  `;
}
