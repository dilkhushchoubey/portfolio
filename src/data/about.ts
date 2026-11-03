/**
 * About page configuration and metadata.
 * Main portrait photograph is located in public/images/about/portrait/
 */

export interface AboutData {
  portrait: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  biography: string[];
  quote: string;
}

export const aboutData: AboutData = {
  portrait: {
    src: '/images/about/portrait/DSC01862.jpg',
    alt: 'Dilkhush Choubey',
    width: 4043,
    height: 3032,
  },
  biography: [
    'Dilkhush Choubey is a photographer from Kolkata, India, whose work explores people, places, culture and everyday life. Working primarily across street, documentary and travel photography, he is drawn to observing the details and interactions that often go unnoticed.',
    "His interest in photography began with his father's first smartphone, when he started photographing insects, flowers and small details around him. Over time, this curiosity developed into an interest in documenting people, their surroundings and the stories embedded in ordinary moments.",
    'His practice is rooted in observation, with a particular interest in cultural traditions, human experiences and the relationship between people and the places they inhabit.',
  ],
  quote:
    '"It all began with taking random photographs, but somewhere along the way, I realised I can\'t imagine a life without photography."',
};
