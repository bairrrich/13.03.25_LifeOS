/**
 * Тесты для Toast компонента
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer } from '@/ui/components/toast';

describe('Toast', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен рендерить info уведомление', () => {
    render(
      <Toast
        id="test-1"
        type="info"
        title="Info Title"
        message="Info Message"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info Message')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('должен рендерить success уведомление', () => {
    render(
      <Toast
        id="test-1"
        type="success"
        title="Success!"
        message="Operation completed"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('должен рендерить warning уведомление', () => {
    render(
      <Toast
        id="test-1"
        type="warning"
        title="Warning"
        message="Be careful"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('должен рендерить error уведомление', () => {
    render(
      <Toast
        id="test-1"
        type="error"
        title="Error"
        message="Something went wrong"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('должен закрываться по клику на кнопку закрытия', async () => {
    const user = userEvent.setup();

    render(
      <Toast
        id="test-1"
        type="info"
        title="Test"
        message="Test"
        onClose={mockOnClose}
        duration={0}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Ждём завершения анимации
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('test-1');
    }, { timeout: 500 });
  });

  it('должен автоматически закрываться через заданное время', async () => {
    jest.useFakeTimers();

    render(
      <Toast
        id="test-1"
        type="info"
        title="Test"
        message="Test"
        onClose={mockOnClose}
        duration={1000}
      />
    );

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('test-1');
    });

    jest.useRealTimers();
  });
});

describe('ToastContainer', () => {
  const mockOnRemove = jest.fn();

  it('должен рендерить список toast уведомлений', () => {
    const toasts = [
      { id: '1', type: 'info' as const, title: 'Toast 1', message: '' },
      { id: '2', type: 'success' as const, title: 'Toast 2', message: '' },
      { id: '3', type: 'error' as const, title: 'Toast 3', message: '' },
    ];

    render(
      <ToastContainer
        toasts={toasts}
        onRemove={mockOnRemove}
        position="top-right"
      />
    );

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('должен ограничивать количество видимых уведомлений', () => {
    const toasts = [
      { id: '1', type: 'info' as const, title: 'Toast 1', message: '' },
      { id: '2', type: 'info' as const, title: 'Toast 2', message: '' },
      { id: '3', type: 'info' as const, title: 'Toast 3', message: '' },
      { id: '4', type: 'info' as const, title: 'Toast 4', message: '' },
      { id: '5', type: 'info' as const, title: 'Toast 5', message: '' },
      { id: '6', type: 'info' as const, title: 'Toast 6', message: '' },
    ];

    render(
      <ToastContainer
        toasts={toasts}
        onRemove={mockOnRemove}
        maxVisible={3}
      />
    );

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.queryByText('Toast 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 6')).not.toBeInTheDocument();
  });

  it('должен позиционироваться в top-right', () => {
    const toasts: Array<{ id: string; type: 'info'; title: string; message?: string }> = [];

    const { container } = render(
      <ToastContainer
        toasts={toasts}
        onRemove={mockOnRemove}
        position="top-right"
      />
    );

    expect(container.firstChild).toHaveClass('top-4', 'right-4');
  });

  it('должен позиционироваться в bottom-left', () => {
    const toasts: Array<{ id: string; type: 'info'; title: string; message?: string }> = [];

    const { container } = render(
      <ToastContainer
        toasts={toasts}
        onRemove={mockOnRemove}
        position="bottom-left"
      />
    );

    expect(container.firstChild).toHaveClass('bottom-4', 'left-4');
  });
});
