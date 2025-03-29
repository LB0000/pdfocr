"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateList;
const TemplateContext_1 = require("@/context/TemplateContext");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
function TemplateList() {
    const { templates, loading, error, fetchTemplates } = (0, TemplateContext_1.useTemplates)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [activeFilter, setActiveFilter] = (0, react_1.useState)('all');
    (0, react_1.useEffect)(() => {
        fetchTemplates();
    }, [fetchTemplates]);
    // 検索とフィルタリング
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesActive = activeFilter === 'all' ||
            (activeFilter === 'active' && template.isActive) ||
            (activeFilter === 'inactive' && !template.isActive);
        return matchesSearch && matchesActive;
    });
    return (<div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">テンプレート一覧</h2>
          <link_1.default href="/templates/create" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            新規テンプレート作成
          </link_1.default>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <input type="text" placeholder="テンプレート名または説明で検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div>
            <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (<div className="flex items-center justify-center p-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>) : error ? (<div className="p-6 text-red-700 bg-red-100">
          エラーが発生しました: {error}
        </div>) : filteredTemplates.length === 0 ? (<div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <p className="mb-4">テンプレートがありません</p>
          <link_1.default href="/templates/create" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            新規テンプレート作成
          </link_1.default>
        </div>) : (<div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (<TemplateCard key={template.id} template={template}/>))}
        </div>)}
    </div>);
}
function TemplateCard({ template }) {
    return (<div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 truncate">{template.name}</h3>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {template.isActive ? '有効' : '無効'}
          </span>
        </div>
        
        {template.description && (<p className="mb-4 text-sm text-gray-500 line-clamp-2">{template.description}</p>)}
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-500">
            作成日: {new Date(template.createdAt).toLocaleDateString('ja-JP')}
          </div>
          
          <link_1.default href={`/templates/${template.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            詳細を見る
          </link_1.default>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=TemplateList.js.map