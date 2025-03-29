"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentDetailPage;
const AuthContext_1 = require("@/context/AuthContext");
const navigation_1 = require("next/navigation");
const DocumentDetail_1 = __importDefault(require("@/components/documents/DocumentDetail"));
const react_1 = require("react");
function DocumentDetailPage({ params }) {
    return (<div className="container p-6 mx-auto">
      <react_1.Suspense fallback={<div>読み込み中...</div>}>
        <DocumentDetailContent documentId={params.id}/>
      </react_1.Suspense>
    </div>);
}
function DocumentDetailContent({ documentId }) {
    const { user, loading } = (0, AuthContext_1.useAuth)();
    if (!loading && !user) {
        (0, navigation_1.redirect)('/login');
    }
    return <DocumentDetail_1.default documentId={documentId}/>;
}
//# sourceMappingURL=page.js.map