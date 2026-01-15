import React, { useState, useEffect } from 'react';
import { getIgnorePatterns, updateIgnorePatterns } from '../api/github';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

interface IgnorePatternsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const IgnorePatternsModal: React.FC<IgnorePatternsModalProps> = ({ isOpen, onClose }) => {
    const [patterns, setPatterns] = useState<string[]>([]);
    const [newPattern, setNewPattern] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadPatterns();
        } else {
            setPatterns([]);
            setNewPattern('');
            setIsLoading(false);
            setIsSaving(false);
        }
    }, [isOpen]);

    const loadPatterns = async () => {
        setIsLoading(true);
        try {
            const data = await getIgnorePatterns();
            setPatterns(data || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPattern = () => {
        if (!newPattern.trim()) return;
        if (patterns.includes(newPattern.trim())) {
            toast.warning('이미 존재하는 패턴입니다.');
            return;
        }
        setPatterns([...patterns, newPattern.trim()]);
        setNewPattern('');
    };

    const handleRemovePattern = (index: number) => {
        const newPatterns = patterns.filter((_, i) => i !== index);
        setPatterns(newPatterns);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateIgnorePatterns(patterns);
            toast.success('Ignore 패턴이 성공적으로 저장되었습니다.');
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPattern();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl bg-[#1a1a1f] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h2 className="text-[15px] font-semibold text-white">Ignore 패턴</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-[12px] text-slate-500 leading-relaxed">
                                코드 리뷰 시 제외할 파일이나 디렉토리 패턴을 설정하세요. (.gitignore 동일 방식)
                            </div>

                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newPattern}
                                    onChange={(e) => setNewPattern(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="예: *.test.js, node_modules/"
                                    className="flex-1 px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 font-mono transition-colors"
                                />
                                <button
                                    onClick={handleAddPattern}
                                    className="px-4 py-2.5 text-[13px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                                >
                                    추가
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="text-[12px] text-slate-500">등록된 패턴 ({patterns.length})</div>
                                <div className="bg-white/[0.02] rounded-lg border border-white/5 min-h-[160px] max-h-[240px] overflow-y-auto">
                                    {patterns.length === 0 ? (
                                        <div className="flex items-center justify-center h-[160px] text-slate-600 text-[12px]">
                                            등록된 패턴이 없습니다.
                                        </div>
                                    ) : (
                                        <ul className="p-2 space-y-1">
                                            {patterns.map((pattern, index) => (
                                                <li key={index} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-lg group hover:bg-white/[0.06] transition-colors">
                                                    <span className="text-slate-300 font-mono text-[12px]">{pattern}</span>
                                                    <button
                                                        onClick={() => handleRemovePattern(index)}
                                                        className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-2 px-5 py-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-[13px] text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/15 hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSaving && (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        <span>{isSaving ? '저장 중...' : '저장'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IgnorePatternsModal;
