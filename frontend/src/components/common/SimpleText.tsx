import { Fragment } from 'react';

/**
 * Renders plain CMS text safely: blank lines separate paragraphs, lines starting with
 * "## " become headings and lines starting with "- " become list items. No HTML is interpreted.
 */
export function SimpleText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={className ?? 'prose-content'}>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        return (
          <Fragment key={i}>
            {lines[0].startsWith('## ') && <h2>{lines[0].slice(3)}</h2>}
            <Body lines={lines[0].startsWith('## ') ? lines.slice(1) : lines} />
          </Fragment>
        );
      })}
    </div>
  );
}

function Body({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  if (lines.every((l) => l.startsWith('- '))) {
    return (
      <ul>
        {lines.map((l, i) => (
          <li key={i}>{l.slice(2)}</li>
        ))}
      </ul>
    );
  }
  return <p>{lines.join(' ')}</p>;
}
