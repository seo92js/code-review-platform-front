import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRules, createRule, updateRule, deleteRule, toggleRule, Rule } from '../api/rule';
import { getErrorMessage } from '../utils/errorMessages';

const TARGET_PRESETS = [
    { label: 'Java', value: '**/*.java' },
    { label: 'JS / TS', value: '**/*.{js,ts}' },
    { label: 'React', value: '**/*.{jsx,tsx}' },
    { label: 'Vue.js', value: '**/*.vue' },
    { label: 'Python', value: '**/*.py' },
    { label: 'C++', value: '**/*.{cpp,h}' },
    { label: 'All Files', value: '**/*' },
];

const RuleManagement: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    // Form states
    const [content, setContent] = useState('');
    const [targetPattern, setTargetPattern] = useState('');

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await getRules();
            setRules(data);
        } catch (error) {
            toast.error('규칙 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (rule?: Rule) => {
        if (rule) {
            setEditingRule(rule);
            setContent(rule.content);
            setTargetPattern(rule.targetFilePattern || '');
        } else {
            setEditingRule(null);
            setContent('');
            setTargetPattern('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRule(null);
        setContent('');
        setTargetPattern('');
    };

    const handleSaveRule = async () => {
        if (!content.trim()) {
            toast.warning('규칙 내용을 입력해주세요.');
            return;
        }

        try {
            if (editingRule) {
                await updateRule(editingRule.id, { content, targetFilePattern: targetPattern });
                toast.success('규칙이 수정되었습니다.');
            } else {
                await createRule({ content, targetFilePattern: targetPattern });
                toast.success('새로운 규칙이 추가되었습니다.');
            }
            handleCloseModal();
            loadRules(); // Reload list
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDeleteRule = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteRule(id);
            toast.success('규칙이 삭제되었습니다.');
            setRules(rules.filter(r => r.id !== id));
        } catch (error) {
            toast.error('삭제 실패');
        }
    };

    const handleToggleRule = async (id: number) => {
        try {
            const updatedRule = await toggleRule(id);
            setRules(rules.map(r => r.id === id ? updatedRule : r));
        } catch (error) {
            toast.error('상태 변경 실패');
        }
    };

    if (isLoading) return <div className="text-center py-4 text-slate-500">Loading rules...</div>;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div>
                    <h3 className="text-[13px] font-medium text-white">규칙</h3>
                </div>

                <div className="flex justify-end pt-1">
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-3 py-1.5 text-[12px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                        + 규칙 추가
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {rules.length === 0 ? (
                    <div className="text-center py-8 bg-white/[0.02] border border-white/5 rounded-xl">
                        <p className="text-[13px] text-slate-500">등록된 규칙이 없습니다.</p>
                        <button onClick={() => handleOpenModal()} className="mt-2 text-[12px] text-blue-400 hover:underline">첫 번째 규칙을 추가해보세요</button>
                    </div>
                ) : (
                    rules.map(rule => (
                        <div key={rule.id} className={`group bg-white/[0.03] border ${rule.isEnabled ? 'border-blue-500/30' : 'border-white/5'} rounded-xl p-4 transition-all hover:bg-white/[0.05]`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        {rule.targetFilePattern && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-300">
                                                {rule.targetFilePattern}
                                            </span>
                                        )}
                                        <span className={`text-[13px] ${rule.isEnabled ? 'text-white' : 'text-slate-500 line-through'}`}>
                                            {rule.content}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleRule(rule.id)}
                                        className={`relative w-9 h-5 rounded-full transition-colors ${rule.isEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule.isEnabled ? 'translate-x-4' : ''}`} />
                                    </button>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border-l border-white/10 pl-3">
                                        <button onClick={() => handleOpenModal(rule)} className="text-slate-500 hover:text-white">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteRule(rule.id)} className="text-slate-500 hover:text-rose-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-[14px] font-medium text-white">{editingRule ? '규칙 수정' : '새 규칙 추가'}</h3>
                            <button onClick={handleCloseModal} className="text-slate-500 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] text-slate-400">규칙 내용 <span className="text-rose-400">*</span></label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="예: DTO 클래스에는 반드시 @Builder 패턴을 적용해야 합니다."
                                    className="w-full h-24 p-3 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] text-slate-400">적용 파일 (Glob Pattern)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={targetPattern}
                                        onChange={(e) => setTargetPattern(e.target.value)}
                                        placeholder="예: **/*.java (비워두면 모든 파일에 적용)"
                                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 font-mono"
                                    />
                                    {/* Preset Chips */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {TARGET_PRESETS.map(preset => (
                                            <button
                                                key={preset.label}
                                                onClick={() => setTargetPattern(preset.value)}
                                                className="px-2 py-1 text-[11px] bg-white/5 hover:bg-white/10 border border-white/5 rounded text-slate-300 hover:text-white transition-colors"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 flex justify-end gap-2 bg-white/[0.01]">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-[13px] text-slate-400 hover:text-white transition-colors">취소</button>
                            <button onClick={handleSaveRule} className="px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RuleManagement;
