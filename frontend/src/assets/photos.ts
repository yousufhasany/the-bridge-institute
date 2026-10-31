import aboutBanner from './photos/banner-about.jpg';
import alumniBanner from './photos/banner-alumni.jpg';
import companiesBanner from './photos/banner-companies.jpg';
import contactBanner from './photos/banner-contact.jpg';
import coursesBanner from './photos/banner-courses.jpg';
import journeyBanner from './photos/banner-journey.jpg';
import partnersBanner from './photos/banner-partners.jpg';
import collaborate from './photos/collaborate.jpg';
import code from './photos/course-code.jpg';
import english from './photos/course-english.jpg';
import ict from './photos/course-ict.jpg';
import math from './photos/course-math.jpg';
import thinking from './photos/course-thinking.jpg';
import hero from './photos/hero-journey.jpg';
import learning from './photos/learning-together.jpg';
import workplace from './photos/workplace.jpg';

/** Illustrative photography. These are not photographs of the institute, its campus, or its learners. */
export const photos = {
  hero,
  learning,
  workplace,
  collaborate,
  courses: coursesBanner,
  partners: partnersBanner,
  journey: journeyBanner,
  alumni: alumniBanner,
  companies: companiesBanner,
  about: aboutBanner,
  contact: contactBanner,
} as const;

const coursePhotos: Record<string, string> = {
  'critical-thinking': thinking,
  'basic-english': english,
  'basic-mathematics': math,
  'basic-ict': ict,
  'basic-python-programming': code,
};

export function coursePhoto(slug: string): string | undefined {
  return coursePhotos[slug];
}
