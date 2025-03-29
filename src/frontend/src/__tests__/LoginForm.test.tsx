import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/auth/LoginForm';
import { AuthProvider } from '../context/AuthContext';

// モックAPI
vi.mock('../lib/api', () => ({
  default: {
    auth: {
      login: vi.fn().mockImplementation((email, password) => {
        if (email === 'test@example.com' && password === 'password123') {
          return Promise.resolve({
            data: {
              token: 'fake-token',
              refreshToken: 'fake-refresh-token',
              user: {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                role: 'user'
              }
            }
          });
        } else {
          return Promise.reject({
            response: {
              data: {
                message: 'Invalid credentials'
              }
            }
          });
        }
      })
    }
  }
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // ローカルストレージのモック
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });
  });

  it('renders login form correctly', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // 空の状態でフォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    // バリデーションエラーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/メールアドレスを入力してください/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid credentials', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // 有効な認証情報を入力
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'password123' }
    });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    // ローカルストレージにトークンが保存されることを確認
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token');
    });
  });

  it('shows error message with invalid credentials', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // 無効な認証情報を入力
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'wrongpassword' }
    });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/認証情報が無効です/i)).toBeInTheDocument();
    });
  });
});
