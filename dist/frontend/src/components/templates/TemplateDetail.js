"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateDetail;
const TemplateContext_1 = require("@/context/TemplateContext");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function TemplateDetail({ templateId }) {
    const [template, setTemplate] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [isActive, setIsActive] = (0, react_1.useState)(true);
    const [fields, setFields] = (0, react_1.useState)([]);
    const { getTemplate, updateTemplate, deleteTemplate } = (0, TemplateContext_1.useTemplates)();
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const templateData = await getTemplate(templateId);
                setTemplate(templateData);
                setName(templateData.name);
                setDescription(templateData.description || '');
                setIsActive(templateData.isActive);
                setFields(templateData.fields || []);
            }
            catch (err) {
                setError(err.message || 'テンプレートの取得に失敗しました');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [templateId, getTemplate]);
    const handleUpdate = async () => {
        if (!template)
            return;
        try {
            setIsLoading(true);
            await updateTemplate(templateId, {
                name,
                description,
                isActive,
                fields
            });
            // 更新後の情報を再取得
            const updatedTemplate = await getTemplate(templateId);
            setTemplate(updatedTemplate);
            setIsEditing(false);
        }
        catch (err) {
            setError(err.message || 'テンプレートの更新に失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!template)
            return;
        if (!confirm('このテンプレートを削除してもよろしいですか？この操作は元に戻せません。')) {
            return;
        }
        try {
            setIsLoading(true);
            await deleteTemplate(templateId);
            router.push('/templates');
        }
        catch (err) {
            setError(err.message || 'テンプレートの削除に失敗しました');
            setIsLoading(false);
        }
    };
    const addField = () => {
        const newField = {
            name: '',
            fieldType: 'text',
            displayOrder: fields.length
        };
        setFields([...fields, newField]);
    };
    const updateField = (index, updatedField) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updatedField };
        setFields(newFields);
    };
    const removeField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        // 表示順序を更新
        const updatedFields = newFields.map((field, idx) => ({
            ...field,
            displayOrder: idx
        }));
        setFields(updatedFields);
    };
    const moveField = (index, direction) => {
        if ((direction === 'up' && index === 0) ||
            (direction === 'down' && index === fields.length - 1)) {
            return;
        }
        const newFields = [...fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        // 入れ替え
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        // 表示順序を更新
        const updatedFields = newFields.map((field, idx) => ({
            ...field,
            displayOrder: idx
        }));
        setFields(updatedFields);
    };
    if (isLoading && !template) {
        return (<div className="flex items-center justify-center p-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>);
    }
    if (error) {
        return (<div className="p-6 text-red-700 bg-red-100 rounded-lg">
        エラーが発生しました: {error}
      </div>);
    }
    if (!template) {
        return (<div className="p-6 text-gray-700 bg-gray-100 rounded-lg">
        テンプレートが見つかりません
      </div>);
    }
    return (<div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">テンプレート詳細</h2>
          <div className="flex space-x-2">
            <button onClick={() => router.push('/templates')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              一覧に戻る
            </button>
            {!isEditing ? (<>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
                  編集
                </button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" disabled={isLoading}>
                  削除
                </button>
              </>) : (<>
                <button onClick={() => {
                setIsEditing(false);
                setName(template.name);
                setDescription(template.description || '');
                setIsActive(template.isActive);
                setFields(template.fields || []);
            }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" disabled={isLoading}>
                  キャンセル
                </button>
                <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" disabled={isLoading || !name.trim()}>
                  保存
                </button>
              </>)}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {isEditing ? (<div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                テンプレート名 *
              </label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required/>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows={3}/>
            </div>
            
            <div>
              <div className="flex items-center">
                <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <label htmlFor="isActive" className="block ml-2 text-sm font-medium text-gray-700">
                  有効
                </label>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">フィールド定義</h3>
                <button type="button" onClick={addField} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  フィールド追加
                </button>
              </div>
              
              {fields.length === 0 ? (<div className="p-4 text-gray-500 bg-gray-50 rounded-md">
                  フィールドが定義されていません。「フィールド追加」ボタンをクリックして追加してください。
                </div>) : (<div className="space-y-4">
                  {fields.map((field, index) => (<div key={index} className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">フィールド #{index + 1}</h4>
                        <div className="flex space-x-2">
                          <button type="button" onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                            ↑
                          </button>
                          <button type="button" onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                            ↓
                          </button>
                          <button type="button" onClick={() => removeField(index)} className="p-1 text-red-500 hover:text-red-700">
                            削除
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            フィールド名 *
                          </label>
                          <input type="text" value={field.name} onChange={(e) => updateField(index, { name: e.target.value })} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required/>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            フィールドタイプ
                          </label>
                          <select value={field.fieldType} onChange={(e) => updateField(index, { fieldType: e.target.value })} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="text">テキスト</option>
                            <option value="number">数値</option>
                            <option value="date">日付</option>
                            <option value="select">選択肢</option>
                            <option value="checkbox">チェックボックス</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            説明
                          </label>
                          <input type="text" value={field.description || ''} onChange={(e) => updateField(index, { description: e.target.value })} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                      </div>
                    </div>))}
                </div>)}
            </div>
          </div>) : (<div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">基本情報</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">テンプレート名</p>
                  <p className="mt-1 text-sm text-gray-900">{template.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">ステータス</p>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {template.isActive ? '有効' : '無効'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">作成日時</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(template.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">最終更新日時</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(template.updatedAt).toLocaleString('ja-JP')}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">説明</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {template.description || '説明はありません'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-medium">フィールド定義</h3>
              {template.fields.length === 0 ? (<div className="p-4 text-gray-500 bg-gray-50 rounded-md">
                  フィールドが定義されていません
                </div>) : (<div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          順序
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          フィールド名
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          タイプ
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          説明
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {template.fields.map((field, index) => (<tr key={field.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{field.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {(() => {
                        switch (field.fieldType) {
                            case 'text': return 'テキスト';
                            case 'number': return '数値';
                            case 'date': return '日付';
                            case 'select': return '選択肢';
                            case 'checkbox': return 'チェックボックス';
                            default: return field.fieldType;
                        }
                    })()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {field.description || '-'}
                            </div>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=TemplateDetail.js.map