import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentUpload from '../components/document/DocumentUpload';
import { AuthProvider } from '../context/AuthContext';

// モックAPI
vi.mock('../lib/api', () => ({
  default: {
    documents: {
      upload: vi.fn().mockImplementation((formData) => {
        return Promise.resolve({
          data: {
            id: 123,
            name: 'test-document.pdf',
            status: 'uploaded',
            createdAt: new Date().toISOString()
          }
        });
      })
    }
  }
}));

describe('DocumentUpload', () => {
  beforeEach(() => {
    // File APIのモック
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  it('renders document upload form correctly', () => {
    render(
      <AuthProvider>
        <DocumentUpload />
      </AuthProvider>
    );
    
    expect(screen.getByText(/ドキュメントをアップロード/i)).toBeInTheDocument();
    expect(screen.getByText(/ここにファイルをドロップ/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <AuthProvider>
        <DocumentUpload />
      </AuthProvider>
    );
    
    // ファイル選択をシミュレート
    const file = new File(['dummy content'], 'test-document.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // ファイル名が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/test-document.pdf/i)).toBeInTheDocument();
    });
  });

  it('validates file type', async () => {
    render(
      <AuthProvider>
        <DocumentUpload />
      </AuthProvider>
    );
    
    // 無効なファイルタイプを選択
    const file = new File(['dummy content'], 'test-document.txt', { type: 'text/plain' });
    const fileInput = screen.getByTestId('file-input');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/PDFファイルのみアップロード可能です/i)).toBeInTheDocument();
    });
  });

  it('uploads file successfully', async () => {
    const mockNavigate = vi.fn();
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockNavigate
      })
    }));
    
    render(
      <AuthProvider>
        <DocumentUpload />
      </AuthProvider>
    );
    
    // ファイル選択をシミュレート
    const file = new File(['dummy content'], 'test-document.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // アップロードボタンをクリック
    const uploadButton = screen.getByRole('button', { name: /アップロード/i });
    fireEvent.click(uploadButton);
    
    // アップロード成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/アップロードが完了しました/i)).toBeInTheDocument();
    });
  });
});
