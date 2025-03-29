import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

// ユーザー登録
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 入力検証
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: '名前、メール、パスワードは必須です', code: 'MISSING_REQUIRED_FIELDS' } });
    }

    // メールアドレスの重複チェック
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: { message: 'このメールアドレスは既に登録されています', code: 'EMAIL_ALREADY_EXISTS' } });
    }

    // パスワードのハッシュ化
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ユーザーの作成
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    
    // ロールの設定（管理者権限は特別な条件下でのみ許可）
    if (role === 'admin' && process.env.ALLOW_ADMIN_CREATION !== 'true') {
      user.role = 'user';
    } else {
      user.role = role || 'user';
    }

    // ユーザーの保存
    await userRepository.save(user);

    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'ユーザーが正常に登録されました',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ error: { message: 'ユーザー登録中にエラーが発生しました', code: 'REGISTRATION_ERROR' } });
  }
};

// ログイン
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 入力検証
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'メールとパスワードは必須です', code: 'MISSING_CREDENTIALS' } });
    }

    // ユーザーの検索（パスワードを含める）
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'isActive']
    });

    // ユーザーが存在しない場合
    if (!user) {
      return res.status(401).json({ error: { message: 'メールアドレスまたはパスワードが無効です', code: 'INVALID_CREDENTIALS' } });
    }

    // アカウントが無効化されている場合
    if (!user.isActive) {
      return res.status(403).json({ error: { message: 'このアカウントは無効化されています', code: 'ACCOUNT_DISABLED' } });
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: { message: 'メールアドレスまたはパスワードが無効です', code: 'INVALID_CREDENTIALS' } });
    }

    // JWTトークンの生成
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn }
    );

    // リフレッシュトークンの生成（実際の実装ではより安全な方法を使用）
    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtSecret + '-refresh',
      { expiresIn: '7d' }
    );

    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'ログインに成功しました',
      user: userWithoutPassword,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: { message: 'ログイン中にエラーが発生しました', code: 'LOGIN_ERROR' } });
  }
};

// トークンのリフレッシュ
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: { message: 'リフレッシュトークンが必要です', code: 'REFRESH_TOKEN_REQUIRED' } });
    }

    // リフレッシュトークンの検証
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const payload = jwt.verify(refreshToken, jwtSecret + '-refresh') as { userId: string };
    
    // ユーザーの検索
    const user = await userRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'role', 'isActive']
    });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: { message: 'リフレッシュトークンが無効です', code: 'INVALID_REFRESH_TOKEN' } });
    }

    // 新しいアクセストークンの生成
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const newToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn }
    );

    res.status(200).json({
      message: 'トークンが正常に更新されました',
      token: newToken
    });
  } catch (error) {
    console.error('トークンリフレッシュエラー:', error);
    res.status(403).json({ error: { message: 'リフレッシュトークンが無効または期限切れです', code: 'INVALID_REFRESH_TOKEN' } });
  }
};

// ログアウト
export const logout = (req: Request, res: Response) => {
  // クライアント側でトークンを削除する実装を想定
  // サーバー側でのブラックリスト実装は将来的な拡張として検討
  res.status(200).json({ message: 'ログアウトに成功しました' });
};
