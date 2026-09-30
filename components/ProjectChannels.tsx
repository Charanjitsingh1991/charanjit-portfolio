import {projectChannels} from '@/lib/project-editorial';

export default function ProjectChannels({slug}: {slug: string}) {
  const channels = projectChannels[slug];
  if (!channels?.length) return null;
  return <section className="case-channels" aria-label="Brand social channels"><span className="eyebrow">Connected presence</span><h2>Beyond the website.</h2><p>The project also connects to the brand’s social channels.</p><div>{channels.map(channel => <a key={channel.url} href={channel.url} target="_blank" rel="noopener noreferrer">{channel.label} ↗</a>)}</div></section>;
}
