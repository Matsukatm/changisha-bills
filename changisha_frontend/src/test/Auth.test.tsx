import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthPage } from '../pages/Auth';
import { useAuthStore } from '../store';

// Mock the store
vi.mock('../store', () => ({
  useAuthStore: vi.fn(),
}));

describe('AuthPage', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null,
    });
  });

  it('renders login form by default', () => {
    render(<AuthPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to manage your bills')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('switches to register form when clicking Sign Up', async () => {
    render(<AuthPage />);
    
    const signUpButton = screen.getByText('Sign Up');
    await userEvent.click(signUpButton);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Get started with Changisha Bills')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('calls login when form is submitted', async () => {
    render(<AuthPage />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByText('Sign In');
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(signInButton);
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
