# Photography Content & Asset Management Guide

This guide explains how to add, edit, replace, and remove photographs across the Dilkhush Choubey portfolio website.

All photographic assets and data structures are strictly modular. Each section of the website has its own dedicated image folder and its own dedicated data file. Adding or replacing a photograph in one section will never affect or break any other section.

---

## Directory & Data File Map

| Section | Image Folder | TypeScript Data File | Purpose |
|---|---|---|---|
| **Homepage** | `public/images/homepage/` | `src/data/masonryPortfolioItems.ts` | 12 curated showcase slots |
| **Projects** | `public/images/projects/[slug]/` | `src/data/projects.ts` | Complete photographic series & stories |
| **Portraits** | `public/images/portraits/` | `src/data/portraits.ts` | Individual standalone portraits |
| **Stills** | `public/images/stills/` | `src/data/stills.ts` | Standalone non-portrait photographs |
| **About** | `public/images/about/portrait/` & `additional/` | `src/data/about.ts` | Photographer portrait & About assets |

---

## 1. Where to Place New Homepage Photographs

The homepage displays 12 curated photograph slots in an editorial masonry layout.

1. **Image Location:**
   Place the image files in:
   ```text
   public/images/homepage/
   ```
   Filenames match their slot numbers: `01.jpg`, `02.JPG`, `03.jpg`, `04.jpg`, `05.JPG`, `06.JPG`, `07.jpg`, `08.jpg`, `09.jpg`, `010.jpg`, `011.jpg`, `012.JPG`.

2. **Data File to Update:**
   ```text
   src/data/masonryPortfolioItems.ts
   ```
   Each entry defines:
   ```ts
   {
     id: '2',
     title: 'Reflections on the Hooghly',
     category: 'portraits',
     location: 'Howrah Ghat, Kolkata',
     year: '2025',
     src: '/images/homepage/02.JPG',
     width: 1536,
     height: 2048,
     aspectRatio: 0.75,
     orientation: 'portrait',
     mobileSpan: 1,
     description: 'Morning light and quiet waters under the cantilever bridge span.',
   }
   ```
   *Tip:* Running `npm run build` or `npm run prebuild` automatically scans the `public/images/homepage/` folder, detects native dimensions, and appends SHA-256 cache-busting fingerprints.

---

## 2. How to Add a New Project and Its Cover Photograph

1. **Create the Project Folder:**
   Create a dedicated subfolder inside `public/images/projects/` using a lowercase, hyphenated slug:
   ```text
   public/images/projects/varanasi-ghats/
   ```

2. **Add Photographs to the Project Folder:**
   Place all photographs for this project—including the cover photograph—into this new folder:
   ```text
   public/images/projects/varanasi-ghats/
   ├── varanasi-01.jpg  (Cover photograph)
   ├── varanasi-02.jpg
   ├── varanasi-03.jpg
   └── varanasi-04.jpg
   ```

3. **Register the Project in `src/data/projects.ts`:**
   Open `src/data/projects.ts` and add a new project object to the `projectsData` array:
   ```ts
   {
     id: 'varanasi-ghats',
     slug: 'varanasi-ghats',
     title: 'Varanasi: Stone and Smoke',
     subtitle: 'Dawn rituals and cremation fires along the ancient river ghats.', // Optional short summary
     kind: 'project', // 'project' for major works, 'series' for suites
     year: '2024',
     location: 'Varanasi, India',
     statement: [
       'A photographic series observing life, ritual devotion, and sacred fire along the Manikarnika and Assi ghats.',
     ],
     coverPhotoId: 'varanasi-01', // ID of the photograph used as the 3:2 cover
     order: 3, // Display position on the Projects page (1, 2, 3...)
     featured: true,
     photographs: [
       {
         id: 'varanasi-01',
         src: '/images/projects/varanasi-ghats/varanasi-01.jpg',
         alt: 'Morning mist and stone steps at Assi Ghat, Varanasi',
         title: 'Assi Ghat at Dawn',
         aspectRatio: '3:2',
         width: 3600,
         height: 2400,
         metadata: {
           location: 'Assi Ghat, Varanasi',
           date: 'November 2024',
           time: '05:45 AM',
         },
       },
       // Add additional photographs...
     ],
   },
   ```

4. **Cover Photograph Requirements:**
   - The cover photograph must maintain a **3:2 aspect ratio** (e.g. 3600x2400, 4032x2688).
   - `coverPhotoId` must match the `id` of the photograph inside the project's `photographs` array.

---

## 3. How to Add Photographs to an Existing Project

1. **Place the Image File:**
   Copy the image into that project's existing folder:
   ```text
   public/images/projects/kumartuli/kumartuli_016.JPG
   ```

2. **Add Entry in `src/data/projects.ts`:**
   Locate the project in `src/data/projects.ts` and append a new photograph object to its `photographs` array:
   ```ts
   {
     id: 'kumartuli-16',
     src: '/images/projects/kumartuli/kumartuli_016.JPG',
     alt: 'Clay straw armature drying in the alley workshop',
     title: 'Drying Armature',
     aspectRatio: '3:2',
     width: 4032,
     height: 2688,
     metadata: {
       location: 'Kumartuli, Kolkata',
       date: '2024',
     },
   },
   ```

---

## 4. How to Add, Rename or Remove Portraits

Portraits are **automatically discovered and synchronized** from the filesystem, honoring your filename hierarchy priority.

1. **Place the Image File:**
   Drop any supported image (`.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`) into:
   ```text
   public/images/portraits/
   ```
   *Examples:* `DSCF9774_1.jpg`, `IMG_9805_1.jpg`, `IMG_1119_2.jpg`, `IMG_4365.JPG`.

2. **Image Hierarchy Suffixes:**
   Use filename suffixes to control display priority:
   - Suffix `_1` or `-1` (e.g. `DSCF9774_1.jpg`) → **Priority 1** (comes first)
   - Suffix `_2` or `-2` (e.g. `IMG_1119_2.jpg`) → **Priority 2** (comes second)
   - Suffix `_3` or `-3` (e.g. `portrait_3.jpg`) → **Priority 3** (comes third)
   - No numeric suffix (e.g. `IMG_4365.JPG`) → **Priority 4** (comes last)

   Within each priority tier, photographs sort naturally by filename.

3. **Automatic Synchronization:**
   - In development mode (`npm run dev`), the live folder watcher automatically registers new, renamed, or deleted files.
   - For manual sync or build preparation, run `npm run sync-images` or `npm run build`.
   - Any newly added photograph automatically receives an entry and a clean title.

4. **Optional: Curate Titles, Locations & Dates:**
   To add or edit titles, locations, and dates for portraits, open:
   ```text
   src/data/portraitsMetadata.json
   ```
   Add or update the entry keyed by base stem (e.g. `DSCF9774`):
   ```json
   "DSCF9774": {
     "title": "Portrait Study I",
     "location": "Varanasi, India",
     "date": "2023"
   }
   ```

---

## 5. How to Add, Rename or Remove Stills

Stills are **automatically discovered and synchronized** from the filesystem, honoring your filename hierarchy priority.

1. **Place the Image File:**
   Drop any supported image (`.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`) into:
   ```text
   public/images/stills/
   ```

2. **Image Hierarchy Suffixes:**
   Use filename suffixes to control display priority:
   - Suffix `_1` or `-1` (e.g. `IMG_0091_1.JPG`) → **Priority 1** (comes first)
   - Suffix `_2` or `-2` (e.g. `IMG_5467_2.jpg`) → **Priority 2** (comes second)
   - Suffix `_3` or `-3` (e.g. `still-touch-3.jpg`) → **Priority 3** (comes third)
   - No numeric suffix (e.g. `DSCF9700.jpg`) → **Priority 4** (comes last)

   Within each priority tier, photographs sort naturally by filename.

3. **Optional: Curate Titles, Locations & Dates:**
   In `src/data/stillsMetadata.json`, add an entry using the base stem (e.g. `IMG_0091`):
   ```json
   "IMG_0091": {
     "title": "Monsoon Over Howrah",
     "location": "Kolkata, India",
     "date": "2024",
     "notes": "Torrential downpour framing vintage state buses below the iconic steel bridge."
   }
   ```
   Renaming the priority suffix (e.g. `IMG_0091_1` to `IMG_0091_2`) automatically preserves the title and metadata.
       date: '2024',
       notes: 'Long exposure of ferry wake under fading twilight.',
     },
   },
   ```

3. **Save and Verify:**
   The new still immediately appears on `/work/stills` within the photo-book sequence and interactive photograph viewer.

---

## 6. How to Remove or Replace a Photograph Without Breaking References

### Replacing an Existing Photograph
1. **Prepare your replacement file** with the same or new filename.
2. Place the file in the section's folder (e.g. `public/images/portraits/`).
3. If the filename or dimensions changed, update the `src`, `width`, and `height` properties in the corresponding data file (`src/data/portraits.ts`, `src/data/stills.ts`, or `src/data/projects.ts`).
4. **Because sections are independent**, replacing a portrait or still will not affect the homepage or any other page.

### Removing a Photograph
1. Open the data file for that section (`src/data/portraits.ts`, `src/data/stills.ts`, or `src/data/projects.ts`).
2. Delete the photograph's block (or comment it out with `/* ... */`).
3. If the removed photo was a project's cover photo, update `coverPhotoId` in `src/data/projects.ts` to another photo's `id`.
4. Delete the physical file from the image folder.

---

## 7. Recommended Filename Conventions

- Use clean, lowercase filenames without spaces or special characters.
- Use hyphens to separate words: `colors-of-braj.jpg`, `nomad-of-thar.jpg`.
- Or use simple sequential IDs: `01.jpg`, `02.jpg`.
- Supported formats: `.jpg`, `.jpeg`, `.webp`, `.png`, `.svg`.

---

## 8. Verification Commands

After making changes to any images or data files, run:

```bash
# Verify TypeScript types
npx tsc --noEmit

# Verify code style and linting
npm run lint

# Build production bundle to verify all static pages prerender cleanly
npm run build
```
