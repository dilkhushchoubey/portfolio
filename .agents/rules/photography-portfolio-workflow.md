# Photography Portfolio Update Workflow

Follow this workflow strictly whenever adding, replacing, renaming, reordering, removing, or updating photographs on this portfolio website.

## 1. Inspect Before Editing
Before making any changes, inspect the relevant project files and folder structure:
- The relevant image folder(s) inside `public/images/` (or `public/`)
- The data/config file that references those images (e.g. `masonryPortfolioItems.ts`, etc.)
- Any components that consume that data
- Existing naming conventions
- Existing image metadata: width, height, aspect ratio, orientation, IDs, titles, and descriptions

Do not assume filenames, extensions, dimensions, or image ordering. Verify them from actual files.

## 2. Understand Requested Change
- If explicit mapping is provided (e.g., `id 1 → 01`), follow it strictly.
- If only new images are provided without explicit mapping, inspect filenames and data structure to determine the most logical mapping.
- If genuinely ambiguous, stop and ask the user rather than guessing.

## 3. Preserve Existing Content
Unless explicitly asked otherwise, preserve:
- IDs, Titles, Categories, Locations, Years, Descriptions, Ordering, `mobileSpan`
- Project relationships, Layout logic, Component structure, Styling, Existing functionality
- Do not rewrite unrelated content or redesign components/styles.

## 4. Image Metadata Must Match Actual Files
For every image added or replaced, inspect the actual file dimensions and update:
- `src`
- `width` (actual pixel width)
- `height` (actual pixel height)
- `aspectRatio` = `width / height`
- `orientation`:
  - `width > height` → `'landscape'`
  - `height > width` → `'portrait'`
  - `width === height` → `'square'`
- Never copy dimensions from old images.

## 5. Filename Handling
Use the exact filename that exists on disk:
- Case sensitivity (`.jpg` vs `.JPG`, `.jpeg`, `.png`, `.webp`)
- Spaces, underscores, hyphens, leading zeros, capitalization
- Never assume interchangeable extensions.
- Do not rename, move, duplicate, compress, convert, or overwrite image files unless explicitly requested.

## 6. No Fake or Guessed Data
- Never create placeholder images, fake filenames, guessed dimensions, guessed metadata, or duplicate references.
- If a referenced image does not exist, report it instead of creating a workaround.

## 7. Check for Broken References
After editing, verify every image referenced actually exists on disk.
Check for missing files, duplicate references, wrong extensions, incorrect capitalization, or leftover references to old files.

## 8. Check the Actual Project Structure
Locate the actual data file in the codebase (e.g., `src/data/masonryPortfolioItems.ts`) rather than assuming paths or creating parallel structures.

## 9. Keep Changes Minimal
Only modify files necessary to complete the request.
Do not redesign, change CSS, alter masonry algorithms, touch components, or touch configuration files unless specifically requested.

## 10. Validate After Editing
1. Verify image files exist on disk.
2. Verify all updated paths are correct.
3. Verify metadata matches actual files.
4. Check TypeScript: `npx tsc --noEmit`
5. Run lint: `npm run lint`
6. Run build when appropriate: `npm run build`
Do not modify code merely to suppress a warning/error unless required for the change.

## 11. Report Structure
Always provide a concise report containing:
- **Files changed**: List every modified file.
- **Image changes**: Show mapping (`id X → path`).
- **Metadata**: Updated dimensions, aspect ratios, orientations.
- **Validation**: Actual status of file existence, TypeScript, lint, build (only report pass if actually run).
- **Problems**: Clear disclosure if anything is ambiguous or unresolved.

## 12. Current Project State is Source of Truth
Inspect the current state before editing. Do not rely on outdated memory or previous turns if the files on disk have changed.
