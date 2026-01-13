import { useState, useEffect } from 'react';
import { getSystemPrompt, updateSystemPrompt } from '../api/github';
import { toast } from 'react-toastify';

interface SystemPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            loadPrompt();
        } else {
            setPrompt('');
            setIsLoading(false);
            setIsSaving(false);
        }
    }, [isOpen]);

    const loadPrompt = async () => {
        setIsLoading(true);
        try {
            const data = await getSystemPrompt();
            setPrompt(data);
        } catch (error) {
            console.error('프롬프트 조회 실패:', error);
            toast.error('프롬프트를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSystemPrompt(prompt);
            toast.success('시스템 프롬프트가 성공적으로 저장되었습니다.');
            onClose();
        } catch (error) {
            console.error('프롬프트 저장 실패:', error);
            toast.error('프롬프트 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] flex flex-col m-4">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">AI 리뷰 설정</h2>
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
                        <div className="space-y-4">
                            <div className="mb-4">
                                <p className="text-left text-sm text-gray-400 leading-relaxed">
                                    AI 리뷰어가 코드 리뷰를 수행할 때 사용할 지시사항을 설정할 수 있습니다. 
                                </p>
                                <p className="text-left text-sm text-gray-400 leading-relaxed">
                                    프롬프트를 통해 리뷰 스타일, 체크 항목, 포맷 등을 커스터마이징할 수 있습니다.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 2000) {
                                            setPrompt(e.target.value);
                                        }
                                    }}
                                    maxLength={2000}
                                    className="w-full h-96 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none font-mono text-sm"
                                    placeholder="ex) 코드 리뷰 시 다음 사항을 중점적으로 확인해주세요 1. 보안 취약점 2. 성능 최적화 3. 코드 가독성 4. 테스트 커버리지"
                                />
                                <div className="flex justify-end">
                                    <span className={`text-xs ${prompt.length >= 2000 ? 'text-red-400' : prompt.length >= 1800 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {prompt.length} / 2000
                                    </span>
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

export default SystemPromptModal;

