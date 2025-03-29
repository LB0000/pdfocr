import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TemplateForm from '../components/template/TemplateForm';
import { AuthProvider } from '../context/AuthContext';

// モックAPI
vi.mock('../lib/api', () => ({
  default: {
    templates: {
      create: vi.fn().mockImplementation((templateData) => {
        return Promise.resolve({
          data: {
            id: 123,
            name: templateData.name,
            description: templateData.description,
            isDefault: templateData.isDefault,
            createdAt: new Date().toISOString()
          }
        });
      }),
      update: vi.fn().mockImplementation((id, templateData) => {
        return Promise.resolve({
          data: {
            id,
            name: templateData.name,
            description: templateData.description,
            isDefault: templateData.isDefault,
            updatedAt: new Date().toISOString()
          }
        });
      })
    }
  }
}));

describe('TemplateForm', () => {
  const mockTemplate = {
    id: 123,
    name: 'テストテンプレート',
    description: 'テスト用のテンプレートです',
    isDefault: false,
    createdAt: '2025-03-29T09:00:00.000Z',
    updatedAt: '2025-03-29T09:00:00.000Z'
  };

  it('renders template creation form correctly', () => {
    render(
      <AuthProvider>
        <TemplateForm />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/テンプレート名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /デフォルトテンプレート/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
  });

  it('renders template edit form with existing data', () => {
    render(
      <AuthProvider>
        <TemplateForm template={mockTemplate} />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/テンプレート名/i)).toHaveValue('テストテンプレート');
    expect(screen.getByLabelText(/説明/i)).toHaveValue('テスト用のテンプレートです');
    expect(screen.getByRole('checkbox', { name: /デフォルトテンプレート/i })).not.toBeChecked();
  });

  it('validates form inputs', async () => {
    render(
      <AuthProvider>
        <TemplateForm />
      </AuthProvider>
    );
    
    // 空の状態でフォーム送信
    fireEvent.click(screen.getByRole('button', { name: /保存/i }));
    
    // バリデーションエラーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/テンプレート名を入力してください/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data for new template', async () => {
    const mockNavigate = vi.fn();
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockNavigate
      })
    }));
    
    render(
      <AuthProvider>
        <TemplateForm />
      </AuthProvider>
    );
    
    // フォームに有効なデータを入力
    fireEvent.change(screen.getByLabelText(/テンプレート名/i), {
      target: { value: '新しいテンプレート' }
    });
    
    fireEvent.change(screen.getByLabelText(/説明/i), {
      target: { value: '新しいテンプレートの説明' }
    });
    
    fireEvent.click(screen.getByRole('checkbox', { name: /デフォルトテンプレート/i }));
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /保存/i }));
    
    // API呼び出しが成功することを確認
    await waitFor(() => {
      expect(screen.getByText(/テンプレートが保存されました/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data for template update', async () => {
    const mockNavigate = vi.fn();
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockNavigate
      })
    }));
    
    render(
      <AuthProvider>
        <TemplateForm template={mockTemplate} />
      </AuthProvider>
    );
    
    // フォームデータを更新
    fireEvent.change(screen.getByLabelText(/テンプレート名/i), {
      target: { value: '更新されたテンプレート' }
    });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /保存/i }));
    
    // API呼び出しが成功することを確認
    await waitFor(() => {
      expect(screen.getByText(/テンプレートが更新されました/i)).toBeInTheDocument();
    });
  });
});
