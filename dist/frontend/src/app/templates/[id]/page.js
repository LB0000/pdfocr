"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateDetailPage;
const AuthContext_1 = require("@/context/AuthContext");
const navigation_1 = require("next/navigation");
const TemplateDetail_1 = __importDefault(require("@/components/templates/TemplateDetail"));
const react_1 = require("react");
function TemplateDetailPage({ params }) {
    return (<div className="container p-6 mx-auto">
      <react_1.Suspense fallback={<div>読み込み中...</div>}>
        <TemplateDetailContent templateId={params.id}/>
      </react_1.Suspense>
    </div>);
}
function TemplateDetailContent({ templateId }) {
    const { user, loading } = (0, AuthContext_1.useAuth)();
    if (!loading && !user) {
        (0, navigation_1.redirect)('/login');
    }
    return <TemplateDetail_1.default templateId={templateId}/>;
}
//# sourceMappingURL=page.js.map