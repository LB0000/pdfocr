"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
const RegisterForm_1 = __importDefault(require("@/components/auth/RegisterForm"));
function RegisterPage() {
    return (<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm_1.default />
    </div>);
}
//# sourceMappingURL=page.js.map