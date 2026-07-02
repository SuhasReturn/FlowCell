import Editor from '@monaco-editor/react';
import { useFlowStore } from '../../store/useFlowStore';

const MONACO_LANG_MAP: Record<string, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
};

export function EditorPanel() {
  const code = useFlowStore((s) => s.code);
  const language = useFlowStore((s) => s.language);
  const setCode = useFlowStore((s) => s.setCode);
  const parseError = useFlowStore((s) => s.parseError);

  const monacoLanguage = MONACO_LANG_MAP[language] || 'javascript';

  return (
    <div className="editor-panel">
      <div className="panel-header">
        <span className="panel-label">editor</span>
        {parseError && (
          <span className="panel-error-hint" title={parseError}>
            {parseError.length > 60 ? parseError.slice(0, 60) + '…' : parseError}
          </span>
        )}
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          language={monacoLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'gutter',
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            wordWrap: 'on',
            tabSize: language === 'python' ? 4 : 2,
            lineHeight: 20,
          }}
        />
      </div>
    </div>
  );
}
