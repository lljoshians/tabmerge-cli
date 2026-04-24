# templateEngine & templateLoader

Provides simple token-based templating for rendering bookmark output in custom formats.

## Templates

Three template keys are supported:

| Key | Default | Placeholders |
|---|---|---|
| `item` | `- [{title}]({url}) [{folder}]` | `title`, `url`, `folder` |
| `folder` | `### {folder} ({count} bookmarks)` | `folder`, `count` |
| `summary` | `Total: {total} bookmarks across {folders} folders` | `total`, `folders` |

## Usage

```js
const { renderBookmarks } = require('./templateEngine');
const { loadTemplates } = require('./templateLoader');

const templates = loadTemplates('./my-templates.json');
const output = renderBookmarks(bookmarks, templates);
console.log(output);
```

## Custom Template File

Create a `.json` file with any subset of the template keys:

```json
{
  "item": "{title} -> {url}",
  "summary": "Exported {total} bookmarks"
}
```

Missing keys fall back to defaults.

## API

### `renderTemplate(template, data)` → `string`
Replace `{key}` placeholders in a template string.

### `renderBookmarks(bookmarks, templates?)` → `string`
Render a full list of bookmarks with a trailing summary line.

### `renderFolderHeader(folder, count, template?)` → `string`
Render a single folder header line.

### `loadTemplates(filePath?)` → `Object`
Load templates from a `.json` or `.js` file, merged with defaults. Pass `null` for defaults only.
