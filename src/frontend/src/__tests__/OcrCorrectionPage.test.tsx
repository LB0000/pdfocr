import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OcrCorrectionPage from '../app/(dashboard)/documents/[id]/correct/page';
import { AuthProvider } from '../context/AuthContext';

// モックパラメータ
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useParams: () => ({
    id: '123'
  })
}));

// モックAPI
vi.mock('../lib/api', () => ({
  default: {
    ocr: {
      getResult: vi.fn().mockImplementation((documentId) => {
        return Promise.resolve({
          data: {
            document: {
              id: documentId,
              name: '請求書_2025-03-15.pdf',
              status: 'processed',
              templateId: 1,
              templateName: '請求書テンプレート',
              createdAt: '2025/03/15 14:30',
              updatedAt: '2025/03/15 14:32',
              pageCount: 2
            },
            fields: [
              { id: 1, name: '請求番号', type: 'text', value: 'INV-2025-0042', confidence: 95, corrected: false },
              { id: 2, name: '発行日', type: 'date', value: '2025/03/15', confidence: 92, corrected: false }
            ]
          }
        });
      }),
      correctField: vi.fn().mockImplementation((documentId, fieldId, value) => {
        return Promise.resolve({
          data: {
            id: fieldId,
            value,
            corrected: true
          }
        });
      }),
      getMarkdown: vi.fn().mockImplementation((documentId) => {
        return Promise.resolve({
          data: {
            markdown: '# 請求書\n\n**請求番号**: INV-2025-0042\n**発行日**: 2025/03/15'
          }
        });
      })
    }
  }
}));

describe('OcrCorrectionPage', () => {
  beforeEach(() => {
    // クリップボードAPIのモック
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve())
      },
      writable: true
    });
  });

  it('renders OCR correction page correctly', async () => {
    render(
      <AuthProvider>
        <OcrCorrectionPage params={{ id: '123' }} />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/OCR結果プレビュー・補正/i)).toBeInTheDocument();
      expect(screen.getByText(/請求書_2025-03-15.pdf/i)).toBeInTheDocument();
    });
  });

  it('displays detected fields', async () => {
    render(
      <AuthProvider>
        <OcrCorrectionPage params={{ id: '123' }} />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/検出されたフィールド/i)).toBeInTheDocument();
      expect(screen.getByText(/請求番号/i)).toBeInTheDocument();
      expect(screen.getByText(/発行日/i)).toBeInTheDocument();
      expect(screen.getByText(/INV-2025-0042/i)).toBeInTheDocument();
    });
  });

  it('allows field value editing', async () => {
    render(
      <AuthProvider>
        <OcrCorrectionPage params={{ id: '123' }} />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/請求番号/i)).toBeInTheDocument();
    });
    
    // 編集ボタンをクリック
    const editButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(editButtons[0]);
    
    // 入力フィールドが表示されることを確認
    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveValue('INV-2025-0042');
    
    // 値を編集
    fireEvent.change(inputField, {
      target: { value: 'INV-2025-0043' }
    });
    
    // 保存ボタンをクリック
    fireEvent.click(screen.getByText(/保存/i));
    
    // 編集後の値が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/INV-2025-0043/i)).toBeInTheDocument();
    });
  });

  it('displays markdown preview', async () => {
    render(
      <AuthProvider>
        <OcrCorrectionPage params={{ id: '123' }} />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/マークダウン/i)).toBeInTheDocument();
      const preElement = screen.getByText(/# 請求書/i);
      expect(preElement).toBeInTheDocument();
    });
  });

  it('allows copying markdown to clipboard', async () => {
    render(
      <AuthProvider>
        <OcrCorrectionPage params={{ id: '123' }} />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/マークダウン/i)).toBeInTheDocument();
    });
    
    // コピーボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: /コピー/i }));
    
    // クリップボードAPIが呼び出されることを確認
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
