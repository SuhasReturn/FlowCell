import { useFlowStore } from '../../store/useFlowStore';
import { getExamplesByLanguage } from '../../utils/examples';
import type { Language } from '../../types';

const languageLabels: Record<Language, string> = {
  javascript: 'JS',
  python: 'Py',
  java: 'Java',
};

const allLanguages: Language[] = ['javascript', 'python', 'java'];

export function Header() {
  const selectedExample = useFlowStore((s) => s.selectedExample);
  const language = useFlowStore((s) => s.language);
  const loadExample = useFlowStore((s) => s.loadExample);
  const setLanguage = useFlowStore((s) => s.setLanguage);
  const parseError = useFlowStore((s) => s.parseError);

  const filteredExamples = getExamplesByLanguage(language);

  return (
    <>
      {parseError && (
        <div className="viz-error-pill" title={parseError}>
          <span className="viz-error-dot" />
          <span>Syntax error</span>
        </div>
      )}

      <select
        id="example-select"
        aria-label="Load example snippet"
        className="viz-select"
        value={selectedExample}
        onChange={(e) => loadExample(e.target.value)}
      >
        {filteredExamples.map((ex) => (
          <option key={ex.key} value={ex.key}>
            {ex.label}
          </option>
        ))}
      </select>

      <div className="viz-lang-group">
        {allLanguages.map((lang) => (
          <button
            key={lang}
            className={`viz-lang-toggle ${language === lang ? 'viz-lang-active' : ''}`}
            onClick={() => setLanguage(lang)}
            aria-label={`Switch to ${lang}`}
          >
            {languageLabels[lang]}
          </button>
        ))}
      </div>
    </>
  );
}
