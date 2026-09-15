# Content Guide for Dilkhush Choubey Portfolio

This guide explains how to add, edit, reorder, and remove photographic work on your website. No deep coding knowledge is required—everything is organized through standard image folders and one central data file.

---

## 1. Where to Put Photographs

All website images live inside the `public/images/` directory:

```text
public/
└── images/
    ├── projects/
    │   ├── kumartuli/
    │   └── rolls-royce-holi/
    │
    └── series/
```

- Major photographic projects go inside: `public/images/projects/[project-folder]/`
- Short series (4–5 photographs) go inside: `public/images/series/[series-folder]/`

> **Note:** Do not create genre folders (such as `street/` or `travel/`). Each body of work has its own dedicated folder.

---

## 2. How to Name Photographs

Use simple, clean, lowercase filenames without spaces or special characters.

Recommended formats:
- Sequential numbers: `01.jpg`, `02.jpg`, `03.jpg`, `04.jpg`
- Or project-prefixed numbers: `kumartuli-01.jpg`, `kumartuli-02.jpg`

Supported file formats: `.jpg`, `.jpeg`, `.webp` (or `.png`).

---

## 3. Where to Create a Folder for a New Project

To add a new major project:
1. Open `public/images/projects/`.
2. Create a new folder named using lowercase letters and hyphens.  
   *Example:* `public/images/projects/ladakh-monasteries/`
3. Place your processed project photographs into that folder.

---

## 4. Where to Create a Folder for a Short Series

To add a 4–5 photograph series:
1. Open `public/images/series/`.
2. Create a new folder with a lowercase, hyphenated name.  
   *Example:* `public/images/series/pushkar-mornings/`
3. Place the 4–5 photographs into that folder.

---

## 5. Where to Add Project Information

All project and series information lives in **one single file**:

`src/data/projects.ts`

Open that file and add a new entry to the `projectsData` list:

```ts
{
  id: 'pushkar-mornings',
  slug: 'pushkar-mornings',
  title: 'Pushkar Mornings',
  kind: 'series', // Use 'project' for major works, or 'series' for 4–5 photo suites
  year: '2024',
  location: 'Pushkar, Rajasthan, India', // Optional
  statement: [
    'A short photographic series observing the morning light over the sacred lake.',
  ], // Optional
  coverPhotoId: 'pushkar-01', // ID of the photograph you want as the cover
  order: 3, // Position in the project list (1 appears first, then 2, 3...)
  featured: true, // Set true to highlight on the homepage
  photographs: [
    // List your photographs here (see Step 6)
  ],
},
```

---

## 6. Where to Add Individual Photograph Information

Inside the `photographs` array of your project in `src/data/projects.ts`, list each photograph:

```ts
{
  id: 'pushkar-01',
  src: '/images/series/pushkar-mornings/01.jpg',
  alt: 'Morning mist rising from Pushkar lake with pilgrims on stone ghats',
  title: 'Assi Ghat at Dawn', // Optional plate title
  aspectRatio: '3:2', // '3:2' or '4:3'
  width: 1800, // Native image width in pixels
  height: 1200, // Native image height in pixels
  metadata: {
    location: 'Brahma Ghat, Pushkar', // Optional
    date: 'November 2024',            // Optional
    time: '06:15 AM',                 // Optional
    notes: 'Natural morning light',   // Optional
  },
},
```

* **Alt text:** Write a short, descriptive sentence of what the photograph depicts. Avoid generic words like "image" or "photo".
* **Metadata:** Keep it minimal. The site displays only `Location`, `Date`, and `Time`.

---

## 7. How to Select a Cover Photograph

Every project has a `coverPhotoId` setting:

```ts
coverPhotoId: 'pushkar-01',
```

Simply set `coverPhotoId` to the `id` of any photograph from that project's `photographs` list.  
You do not have to duplicate the image data, and it does not have to be the first photograph.

---

## 8. How to Control Photograph Order

The website displays photographs in the exact order they appear in the `photographs` array inside `src/data/projects.ts`.

To change the sequence, simply cut and paste a photograph block higher or lower in the array:

```ts
photographs: [
  // This photograph will be displayed 1st:
  { id: 'kumartuli-03', ... },
  // This photograph will be displayed 2nd:
  { id: 'kumartuli-01', ... },
  // This photograph will be displayed 3rd:
  { id: 'kumartuli-02', ... },
]
```

The site does not sort by filename or filesystem date; you have full creative control over the sequence.

---

## 9. How Aspect Ratios Work

Your photographs are predominantly **3:2** and **4:3** landscape:

- **3:2 Aspect Ratio:** Standard 35mm full-frame format (e.g., width: `1800`, height: `1200`).
- **4:3 Aspect Ratio:** Medium format / standard ratio (e.g., width: `1600`, height: `1200`).

In the photograph data, specify:
```ts
aspectRatio: '3:2', // or '4:3'
width: 1800,
height: 1200,
```

**Crucial:** The website never crops your photographs to force them into a uniform box. The layout adapts around the photograph's native aspect ratio, preserving your intended framing and composition.

---

## 10. How to Remove or Archive a Work

To remove or archive a project from the website:
1. Open `src/data/projects.ts`.
2. Locate the project block inside `projectsData`.
3. Either:
   - **Delete the block entirely**, or
   - **Comment it out** by wrapping it in `/* ... */`.
4. Run `npm run build` to verify the site builds cleanly without it.
5. The project page and its navigation link will immediately disappear from the site.
