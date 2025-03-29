"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, req, res, next) {
    console.error(err);
    // エラーステータスコードの設定（デフォルトは500）
    const statusCode = err.status || 500;
    // エラーレスポンスの作成
    const errorResponse = {
        error: {
            message: err.message || 'サーバー内部エラーが発生しました',
            code: err.code || 'INTERNAL_SERVER_ERROR',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    };
    // エラーレスポンスの送信
    res.status(statusCode).json(errorResponse);
}
//# sourceMappingURL=errorHandler.js.map