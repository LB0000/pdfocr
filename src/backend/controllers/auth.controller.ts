import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

// ユーザー登録
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 入力検証
    if (!name || !email || !password) {
      return res.status(400).json({ message: '名前、メールアドレス、パスワードは必須です' });
    }

    // 既存ユーザーの確認
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'このメールアドレスは既に登録されています' });
    }

    // パスワードのハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    // ユーザーの作成
    const user = new User();
    user.name = name;
    user.email = email;
    user.passwordHash = passwordHash;
    user.role = 'user';

    await userRepository.save(user);

    // レスポンス（パスワードハッシュを除外）
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// ログイン
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 入力検証
    if (!email || !password) {
      return res.status(400).json({ message: 'メールアドレスとパスワードは必須です' });
    }

    // ユーザーの検索
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // JWTトークンの生成
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // レスポンス（パスワードハッシュを除外）
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
