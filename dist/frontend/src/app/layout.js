"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const Providers_1 = require("@/context/Providers");
require("./globals.css");
const google_1 = require("next/font/google");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'PDF2MD 拡張システム',
    description: 'PDFからOCRを行い、高度なレイアウト解析や機械学習による補正機能を提供するシステム',
};
function RootLayout({ children, }) {
    return (<html lang="ja">
      <body className={inter.className}>
        <Providers_1.Providers>
          {children}
        </Providers_1.Providers>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map