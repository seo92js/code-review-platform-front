import React, { useState, useEffect } from 'react';
import { getIgnorePatterns, updateIgnorePatterns } from '../api/github';
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
            console.error('Ignore 패턴 조회 실패:', error);
            toast.error('Ignore 패턴을 불러오는데 실패했습니다.');
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
            console.error('Ignore 패턴 저장 실패:', error);
            toast.error('Ignore 패턴 저장에 실패했습니다.');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] flex flex-col m-4">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Ignore 설정</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-4">
                                    코드 리뷰 시 제외할 파일이나 디렉토리 패턴을 설정하세요. (.gitignore 동일 방식)
                                </p>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newPattern}
                                        onChange={(e) => setNewPattern(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="예: *.test.js, node_modules/"
                                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                    />
                                    <button
                                        onClick={handleAddPattern}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-300">등록된 패턴 ({patterns.length})</h3>
                                <div className="bg-slate-900/30 rounded-lg border border-slate-700/30 min-h-[200px] max-h-[300px] overflow-y-auto p-2">
                                    {patterns.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                            등록된 패턴이 없습니다.
                                        </div>
                                    ) : (
                                        <ul className="space-y-2">
                                            {patterns.map((pattern, index) => (
                                                <li key={index} className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-md group hover:bg-slate-800 transition-colors">
                                                    <span className="text-gray-300 font-mono text-sm">{pattern}</span>
                                                    <button
                                                        onClick={() => handleRemovePattern(index)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <div className="p-6 border-t border-slate-700/50 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:border-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSaving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{isSaving ? '저장 중...' : '저장'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IgnorePatternsModal;
