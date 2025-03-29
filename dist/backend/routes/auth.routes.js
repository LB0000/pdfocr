"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// 認証関連のルート
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/logout', auth_1.authenticateJWT, auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map