import type {Project} from '@/lib/catalog';

export default function ProjectStructuredData({project}: {project: Project}) {
  const base = process.env.SITE_URL || 'https://thecharanjitsingh.com';
  const image = project.socialImage || project.coverImage;
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': base + '/work/' + project.slug + '#project',
    name: project.title,
    headline: project.seoTitle || project.title,
    description: project.seoDescription || project.description,
    url: base + '/work/' + project.slug,
    image: image ? new URL(image, base).toString() : undefined,
    creator: {'@id': base + '/#person'},
    about: project.client || undefined,
    keywords: project.tech.split(',').map(item => item.trim()).filter(Boolean),
    inLanguage: 'en',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(graph).replace(/</g, '\u003c')}}/>;
}
