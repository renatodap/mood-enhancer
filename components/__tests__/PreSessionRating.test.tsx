import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PreSessionRating from '../PreSessionRating';

describe('PreSessionRating', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('should display feeling-specific question', () => {
    render(
      <PreSessionRating
        feeling="overwhelmed"
        userName="Alex"
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/how overwhelmed/i)).toBeInTheDocument();
  });

  it('should render MoodRatingScale component', () => {
    render(
      <PreSessionRating
        feeling="anxious"
        userName="Sam"
        onComplete={mockOnComplete}
      />
    );

    // Check for rating buttons
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should disable continue button until rating selected', () => {
    render(
      <PreSessionRating
        feeling="sad"
        userName="Jamie"
        onComplete={mockOnComplete}
      />
    );

    const continueButton = screen.getByText(/continue/i);
    expect(continueButton).toBeDisabled();
  });

  it('should enable continue button after rating selected', () => {
    render(
      <PreSessionRating
        feeling="stressed"
        userName="Taylor"
        onComplete={mockOnComplete}
      />
    );

    const rating7 = screen.getByText('7');
    fireEvent.click(rating7);

    const continueButton = screen.getByText(/continue/i);
    expect(continueButton).not.toBeDisabled();
  });

  it('should call onComplete with rating when continue clicked', () => {
    render(
      <PreSessionRating
        feeling="lonely"
        userName="Jordan"
        onComplete={mockOnComplete}
      />
    );

    const rating5 = screen.getByText('5');
    fireEvent.click(rating5);

    const continueButton = screen.getByText(/continue/i);
    fireEvent.click(continueButton);

    expect(mockOnComplete).toHaveBeenCalledWith(5);
  });

  it('should show user name in message', () => {
    const userName = 'Casey';
    render(
      <PreSessionRating
        feeling="frustrated"
        userName={userName}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(new RegExp(userName, 'i'))).toBeInTheDocument();
  });
});