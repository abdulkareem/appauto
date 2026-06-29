import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('states the non-aggregator positioning', () => {
    render(<HomePage />);
    expect(screen.getByText(/never assigns rides/i)).toBeTruthy();
  });
});
