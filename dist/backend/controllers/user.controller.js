"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
// すべてのユーザーを取得
const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.find({
            select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('ユーザー一覧取得エラー:', error);
        res.status(500).json({ error: { message: 'ユーザー一覧の取得中にエラーが発生しました', code: 'USERS_FETCH_ERROR' } });
    }
};
exports.getAllUsers = getAllUsers;
// 特定のユーザーを取得
const getUserById = async (req, res) => {
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
    }
    catch (error) {
        console.error('ユーザー取得エラー:', error);
        res.status(500).json({ error: { message: 'ユーザーの取得中にエラーが発生しました', code: 'USER_FETCH_ERROR' } });
    }
};
exports.getUserById = getUserById;
// 新しいユーザーを作成
const createUser = async (req, res) => {
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
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // ユーザーの作成
        const user = new User_1.User();
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
    }
    catch (error) {
        console.error('ユーザー作成エラー:', error);
        res.status(500).json({ error: { message: 'ユーザーの作成中にエラーが発生しました', code: 'USER_CREATE_ERROR' } });
    }
};
exports.createUser = createUser;
// ユーザー情報を更新
const updateUser = async (req, res) => {
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
        if (name)
            user.name = name;
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
            user.password = await bcrypt_1.default.hash(password, saltRounds);
        }
        await userRepository.save(user);
        // パスワードを除外してレスポンスを返す
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            message: 'ユーザー情報が正常に更新されました',
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('ユーザー更新エラー:', error);
        res.status(500).json({ error: { message: 'ユーザーの更新中にエラーが発生しました', code: 'USER_UPDATE_ERROR' } });
    }
};
exports.updateUser = updateUser;
// ユーザーを削除
const deleteUser = async (req, res) => {
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
    }
    catch (error) {
        console.error('ユーザー削除エラー:', error);
        res.status(500).json({ error: { message: 'ユーザーの削除中にエラーが発生しました', code: 'USER_DELETE_ERROR' } });
    }
};
exports.deleteUser = deleteUser;
// ユーザーロールを更新
const updateUserRole = async (req, res) => {
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
    }
    catch (error) {
        console.error('ロール更新エラー:', error);
        res.status(500).json({ error: { message: 'ロールの更新中にエラーが発生しました', code: 'ROLE_UPDATE_ERROR' } });
    }
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=user.controller.js.map