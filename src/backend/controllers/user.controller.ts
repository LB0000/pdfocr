import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

// すべてのユーザーを取得
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    res.status(500).json({ error: { message: 'ユーザー一覧の取得中にエラーが発生しました', code: 'USERS_FETCH_ERROR' } });
  }
};

// 特定のユーザーを取得
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 自分自身または管理者のみアクセス可能
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    const user = await userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    res.status(500).json({ error: { message: 'ユーザーの取得中にエラーが発生しました', code: 'USER_FETCH_ERROR' } });
  }
};

// 新しいユーザーを作成
export const createUser = async (req: Request, res: Response) => {
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
    user.role = role || 'user';
    
    await userRepository.save(user);
    
    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'ユーザーが正常に作成されました',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    res.status(500).json({ error: { message: 'ユーザーの作成中にエラーが発生しました', code: 'USER_CREATE_ERROR' } });
  }
};

// ユーザー情報を更新
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    // 自分自身または管理者のみ更新可能
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    // 更新するフィールドの設定
    if (name) user.name = name;
    
    // メールアドレスの更新（重複チェック）
    if (email && email !== user.email) {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: { message: 'このメールアドレスは既に使用されています', code: 'EMAIL_ALREADY_EXISTS' } });
      }
      user.email = email;
    }
    
    // パスワードの更新
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }
    
    await userRepository.save(user);
    
    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'ユーザー情報が正常に更新されました',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('ユーザー更新エラー:', error);
    res.status(500).json({ error: { message: 'ユーザーの更新中にエラーが発生しました', code: 'USER_UPDATE_ERROR' } });
  }
};

// ユーザーを削除
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    // 自分自身を削除することはできない
    if (req.user?.id === id) {
      return res.status(400).json({ error: { message: '自分自身を削除することはできません', code: 'CANNOT_DELETE_SELF' } });
    }
    
    await userRepository.remove(user);
    
    res.status(200).json({ message: 'ユーザーが正常に削除されました' });
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    res.status(500).json({ error: { message: 'ユーザーの削除中にエラーが発生しました', code: 'USER_DELETE_ERROR' } });
  }
};

// ユーザーロールを更新
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !['admin', 'manager', 'user'].includes(role)) {
      return res.status(400).json({ error: { message: '有効なロールを指定してください', code: 'INVALID_ROLE' } });
    }
    
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    // 自分自身のロールは変更できない
    if (req.user?.id === id) {
      return res.status(400).json({ error: { message: '自分自身のロールを変更することはできません', code: 'CANNOT_CHANGE_OWN_ROLE' } });
    }
    
    user.role = role;
    await userRepository.save(user);
    
    res.status(200).json({
      message: 'ユーザーロールが正常に更新されました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('ロール更新エラー:', error);
    res.status(500).json({ error: { message: 'ロールの更新中にエラーが発生しました', code: 'ROLE_UPDATE_ERROR' } });
  }
};
