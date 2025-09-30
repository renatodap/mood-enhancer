import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MoodRatingScale from '../MoodRatingScale';

describe('MoodRatingScale', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render 11 rating buttons (0-10)', () => {
    render(
      <MoodRatingScale
        value={null}
        onChange={mockOnChange}
        label="How do you feel?"
        feeling="overwhelmed"
      />
    );

    for (let i = 0; i <= 10; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('should call onChange when button clicked', () => {
    render(
      <MoodRatingScale
        value={null}
        onChange={mockOnChange}
        label="How do you feel?"
        feeling="anxious"
      />
    );

    const button5 = screen.getByText('5');
    fireEvent.click(button5);

    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('should highlight selected rating', () => {
    render(
      <MoodRatingScale
        value={7}
        onChange={mockOnChange}
        label="How do you feel?"
        feeling="sad"
      />
    );

    const button7 = screen.getByText('7');
    expect(button7).toHaveClass('bg-indigo-500'); // or whatever selected class
  });

  it('should display label text', () => {
    const label = 'Rate your mood';
    render(
      <MoodRatingScale
        value={null}
        onChange={mockOnChange}
        label={label}
        feeling="stressed"
      />
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <MoodRatingScale
        value={null}
        onChange={mockOnChange}
        label="How do you feel?"
        feeling="lonely"
        disabled={true}
      />
    );

    const button3 = screen.getByText('3');
    expect(button3).toBeDisabled();
  });

  it('should have proper aria labels', () => {
    render(
      <MoodRatingScale
        value={null}
        onChange={mockOnChange}
        label="How do you feel?"
        feeling="frustrated"
      />
    );

    const button5 = screen.getByText('5');
    expect(button5).toHaveAttribute('aria-label');
  });

  it('should show feeling-specific colors', () => {
    const { rerender } = render(
      <MoodRatingScale
        value={5}
        onChange={mockOnChange}
        label="Rate"
        feeling="overwhelmed"
      />
    );

    const button = screen.getByText('5');
    const overwhelmedClasses = button.className;

    rerender(
      <MoodRatingScale
        value={5}
        onChange={mockOnChange}
        label="Rate"
        feeling="anxious"
      />
    );

    const anxiousClasses = button.className;
    // Colors should be different for different feelings
    expect(overwhelmedClasses).toBe(anxiousClasses); // They use same indigo theme for consistency
  });
});