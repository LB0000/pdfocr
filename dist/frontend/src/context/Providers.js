"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = Providers;
const AuthContext_1 = require("@/context/AuthContext");
const DocumentContext_1 = require("@/context/DocumentContext");
const TemplateContext_1 = require("@/context/TemplateContext");
function Providers({ children }) {
    return (<AuthContext_1.AuthProvider>
      <DocumentContext_1.DocumentProvider>
        <TemplateContext_1.TemplateProvider>
          {children}
        </TemplateContext_1.TemplateProvider>
      </DocumentContext_1.DocumentProvider>
    </AuthContext_1.AuthProvider>);
}
//# sourceMappingURL=Providers.js.map