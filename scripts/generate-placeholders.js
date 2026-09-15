const fs = require('fs');
const path = require('path');

const images = [
  {
    path: 'public/images/projects/kumartuli/kumartuli-01.svg',
    w: 1800,
    h: 1200,
    aspect: '3:2',
    title: 'The First Layer',
    project: 'Kumartuli: Where Clay Becomes Faith',
    location: 'Kolkata, India',
    date: '2023',
    palette: ['#1c1a17', '#2b2723', '#8b7355'],
  },
  {
    path: 'public/images/projects/kumartuli/kumartuli-02.svg',
    w: 1600,
    h: 1200,
    aspect: '4:3',
    title: 'Skeletons in Straw',
    project: 'Kumartuli: Where Clay Becomes Faith',
    location: 'Kolkata, India',
    date: '2023',
    palette: ['#161614', '#262420', '#7d6952'],
  },
  {
    path: 'public/images/projects/kumartuli/kumartuli-03.svg',
    w: 1800,
    h: 1200,
    aspect: '3:2',
    title: 'Chokkhu Daan: Bestowing Vision',
    project: 'Kumartuli: Where Clay Becomes Faith',
    location: 'Kolkata, India',
    date: '2023',
    palette: ['#181715', '#2a2622', '#a68a68'],
  },
  {
    path: 'public/images/projects/kumartuli/kumartuli-04.svg',
    w: 1800,
    h: 1200,
    aspect: '3:2',
    title: 'The Threshold of the River',
    project: 'Kumartuli: Where Clay Becomes Faith',
    location: 'Kolkata, India',
    date: '2023',
    palette: ['#15181c', '#222830', '#63758a'],
  },
  {
    path: 'public/images/projects/rolls-royce-holi/rolls-royce-01.svg',
    w: 1800,
    h: 1200,
    aspect: '3:2',
    title: 'The Coated Silver Ghost',
    project: 'Rolls Royce Holi',
    location: 'Rajasthan, India',
    date: '2024',
    palette: ['#211517', '#3b1c24', '#b84d66'],
  },
  {
    path: 'public/images/projects/rolls-royce-holi/rolls-royce-02.svg',
    w: 1600,
    h: 1200,
    aspect: '4:3',
    title: 'Canopy of Vermilion',
    project: 'Rolls Royce Holi',
    location: 'Rajasthan, India',
    date: '2024',
    palette: ['#241517', '#421f26', '#c95454'],
  },
  {
    path: 'public/images/projects/rolls-royce-holi/rolls-royce-03.svg',
    w: 1800,
    h: 1200,
    aspect: '3:2',
    title: 'Intermission in Ochre',
    project: 'Rolls Royce Holi',
    location: 'Rajasthan, India',
    date: '2024',
    palette: ['#221915', '#3d2b1f', '#bf8243'],
  },
  {
    path: 'public/images/projects/rolls-royce-holi/rolls-royce-04.svg',
    w: 1600,
    h: 1200,
    aspect: '4:3',
    title: 'Spirit of Ecstasy in Gulal',
    project: 'Rolls Royce Holi',
    location: 'Rajasthan, India',
    date: '2024',
    palette: ['#1f1618', '#381f26', '#a1425e'],
  },
  {
    path: 'public/images/dilkhush-choubey/portrait.svg',
    w: 1200,
    h: 1500,
    aspect: '4:5',
    title: 'Dilkhush Choubey',
    project: 'Photographer Portrait',
    location: 'India',
    date: '2024',
    palette: ['#181818', '#252525', '#737373'],
  },
];

for (const img of images) {
  const fullPath = path.join(process.cwd(), img.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${img.w} ${img.h}" width="${img.w}" height="${img.h}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${img.palette[0]}" />
      <stop offset="60%" stop-color="${img.palette[1]}" />
      <stop offset="100%" stop-color="${img.palette[0]}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${img.palette[2]}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${img.palette[0]}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${img.w}" height="${img.h}" fill="url(#bgGrad)" />
  <rect width="${img.w}" height="${img.h}" fill="url(#glow)" />
  <rect x="32" y="32" width="${img.w - 64}" height="${img.h - 64}" fill="none" stroke="${img.palette[2]}" stroke-opacity="0.25" stroke-width="1" />
  
  <g font-family="Newsreader, Georgia, serif" fill="#e8e5df" text-anchor="middle">
    <text x="${img.w / 2}" y="${img.h / 2 - 30}" font-size="34" letter-spacing="1.5" font-weight="300">${img.title}</text>
    <text x="${img.w / 2}" y="${img.h / 2 + 20}" font-family="Inter, -apple-system, sans-serif" font-size="14" letter-spacing="3" text-transform="uppercase" fill="#a49e94">${img.project}</text>
    <text x="${img.w / 2}" y="${img.h / 2 + 55}" font-family="Inter, -apple-system, sans-serif" font-size="12" letter-spacing="2" fill="#78736a">${img.location} · ${img.date} · [${img.aspect}]</text>
  </g>

  <g font-family="Inter, -apple-system, sans-serif" font-size="11" letter-spacing="2" fill="#666159">
    <text x="56" y="${img.h - 52}">DILKHUSH CHOUBEY ARCHIVE</text>
    <text x="${img.w - 56}" y="${img.h - 52}" text-anchor="end">${img.w} × ${img.h} · ${img.aspect}</text>
  </g>
</svg>`;

  fs.writeFileSync(fullPath, svg, 'utf-8');
}

console.log(`Generated ${images.length} placeholder SVGs successfully.`);
