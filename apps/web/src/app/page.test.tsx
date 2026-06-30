import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

describe('HomePage source', () => {
  it('states the non-aggregator positioning', () => {
    const source = readFileSync(join(process.cwd(), 'src/app/page.tsx'), 'utf8');
    expect(source).toContain('never assigns rides');
    expect(source).toContain('Discover drivers');
  });
});
