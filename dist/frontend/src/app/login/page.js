"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const LoginForm_1 = __importDefault(require("@/components/auth/LoginForm"));
function LoginPage() {
    return (<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm_1.default />
    </div>);
}
//# sourceMappingURL=page.js.map