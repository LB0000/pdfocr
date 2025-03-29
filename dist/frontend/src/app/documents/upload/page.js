"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentUploadPage;
const AuthContext_1 = require("@/context/AuthContext");
const navigation_1 = require("next/navigation");
const DocumentUploadForm_1 = __importDefault(require("@/components/documents/DocumentUploadForm"));
const react_1 = require("react");
function DocumentUploadPage() {
    return (<div className="container p-6 mx-auto">
      <react_1.Suspense fallback={<div>読み込み中...</div>}>
        <DocumentUploadContent />
      </react_1.Suspense>
    </div>);
}
function DocumentUploadContent() {
    const { user, loading } = (0, AuthContext_1.useAuth)();
    if (!loading && !user) {
        (0, navigation_1.redirect)('/login');
    }
    return <DocumentUploadForm_1.default />;
}
//# sourceMappingURL=page.js.map