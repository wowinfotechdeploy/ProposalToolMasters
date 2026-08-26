import { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
import { Calendar } from './Calendar';
import { parse, isWithinInterval, format, isValid, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

/**
 * @typedef {Object} Option
 * @property {string} display
 * @property {string|number} value
 * @property {number} [id]
 */

/**
 * @typedef {Object} Range
 * @property {string} display
 * @property {number} startValue
 * @property {number} endValue
 * @property {number} [value]
 * @property {number} [id]
 * @property {number} [from]
 * @property {number} [to]
 */

/**
 * @typedef {Object} Period
 * @property {string} periodStart
 * @property {string} periodEnd
 * @property {number} value
 * @property {number} id
 * @property {string} [from]
 * @property {string} [to]
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} questionText
 * @property {'variation' | 'slab' | 'date' | 'quantity' | 'text'} type
 * @property {boolean} [isAdditional]
 * @property {Option[]} [options]
 * @property {Range[]} [ranges]
 * @property {Object} [dateConfig]
 * @property {string} [dateConfig.format]
 * @property {Period[]} [dateConfig.periods]
 * @property {Object} [quantityConfig]
 * @property {number} [quantityConfig.min]
 * @property {number} [quantityConfig.max]
 * @property {number} [quantityConfig.step]
 * @property {Object} [textConfig]
 * @property {string} [textConfig.placeholder]
 * @property {number} [textConfig.maxLength]
 * @property {Object} [dependsOn]
 * @property {string} dependsOn.parentQuestionId
 * @property {number|null} dependsOn.requiredVariationID
 * @property {string|number|Object} [defaultValue]
 */

/**
 * @typedef {Object} UserInputsUIProps
 * @property {Question[]} questions
 * @property {string} [groupLabel]
 * @property {string} [instructions]
 * @property {boolean} disabled
 * @property {(responses: Record<string, any>) => void} onChange
 */

// Separate component for date input
function DateInput({
  question,
  value,
  onChange,
  disabled,
  baseInputClasses,
}) {
  const dateFormat = question.dateConfig?.format || 'dd-MM-yyyy';
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Helper function to parse period dates
  const parsePeriodDate = (dateStr) => {
    if (!dateStr?.trim()) return null;
    try {
      const isoDate = parseISO(dateStr);
      if (isValid(isoDate)) return isoDate;
      const parsed = parse(dateStr, dateFormat, new Date());
      if (isValid(parsed) && parsed.getFullYear() > 1900) return parsed;
      return null;
    } catch {
      // ignore
      return null;
    }
  };

  // Helper function to check if a date is DISABLED
  const isDateDisabled = (date) => {
    if (!question.dateConfig?.periods || question.dateConfig.periods.length === 0) {
      return false;
    }
    return !question.dateConfig.periods.some(period => {
      const periodStartValue = period.periodStart || period.from;
      if (!periodStartValue) return false;
      const fromDate = parsePeriodDate(periodStartValue);
      const periodEndValue = period.periodEnd || period.to;
      if (!periodEndValue) return false;
      const toDate = parsePeriodDate(periodEndValue);
      if (!fromDate || !toDate) return false;
      return isWithinInterval(date, { start: fromDate, end: toDate });
    });
  };

  // Parse current value to Date object
  let currentDate;
  if (value && value.trim()) {
    try {
      const parsedDate = parse(value, dateFormat, new Date());
      if (isValid(parsedDate) && parsedDate.getFullYear() > 1900) {
        currentDate = parsedDate;
      }
    } catch (error) {
      console.warn(`Failed to parse current date value: "${value}"`, error);
    }
  }

  // Calculate default month
  let defaultMonth;
  if (!currentDate && question.dateConfig?.periods && question.dateConfig.periods.length > 0) {
    const firstPeriod = question.dateConfig.periods[0];
    const periodStart = firstPeriod?.periodStart || firstPeriod?.from;
    if (periodStart) {
      const parsedDefaultMonth = parsePeriodDate(periodStart);
      if (parsedDefaultMonth) {
        defaultMonth = parsedDefaultMonth;
      }
    }
  } else if (currentDate) {
    defaultMonth = currentDate;
  }

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCalendarOpen]);

  const handleTextInputBlur = () => {
    if (value.trim()) {
      try {
        const parsed = parse(value, dateFormat, new Date());
        if (!isValid(parsed) || parsed.getFullYear() <= 1900) {
          console.warn(`Invalid date format: "${value}". Expected: "${dateFormat}"`);
        }
      } catch (error) {
        console.warn(`Failed to parse date: "${value}"`, error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleTextInputBlur}
          placeholder={dateFormat}
          className={baseInputClasses + " pr-10"}
          aria-label={question.questionText}
        />
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          disabled={disabled}
          className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Open calendar"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg"
          >
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => {
                if (date) {
                  const formattedDate = format(date, dateFormat);
                  onChange(formattedDate);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={isDateDisabled}
              defaultMonth={defaultMonth}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={2100}
              className="rounded-lg border-0 bg-zinc-800 text-zinc-100"
            />
          </div>
        )}
      </div>
      {question.dateConfig?.periods && question.dateConfig.periods.length > 0 && (
        <div className="text-xs text-zinc-500">
          Available periods: {question.dateConfig.periods.map(p => `${p.periodStart || p.from} to ${p.periodEnd || p.to}`).join(', ')}
        </div>
      )}
    </div>
  );
}

// Helper to calculate default values from questions array
const calculateDefaults = (questions) => {
  const initial = {};
  questions.forEach(q => {
    if (q.defaultValue !== undefined && q.defaultValue !== null && q.defaultValue !== '') {
      if (q.type === 'variation') {
        let matchedValue = null;
        let targetId;

        if (typeof q.defaultValue === 'object' && q.defaultValue !== null) {
          targetId = q.defaultValue.id;
        } else if (typeof q.defaultValue === 'string') {
          try {
            const parsed = JSON.parse(q.defaultValue);
            targetId = parsed.id;
          } catch {
            // ignore
          }
        }

        if (targetId !== undefined && q.options) {
          const matchedOption = q.options.find(opt => opt.id === targetId);
          if (matchedOption) {
            matchedValue = JSON.stringify({ display: matchedOption.display, id: matchedOption.id });
          }
        }

        if (matchedValue) {
          initial[q.id] = matchedValue;
        } else {
          initial[q.id] = typeof q.defaultValue === 'object' ? JSON.stringify(q.defaultValue) : q.defaultValue;
        }
      }
      else if (q.type === 'slab') {
        let matchedValue = null;
        let targetId;

        if (typeof q.defaultValue === 'object' && q.defaultValue !== null) {
          targetId = q.defaultValue.id;
        } else if (typeof q.defaultValue === 'string') {
          try {
            const parsed = JSON.parse(q.defaultValue);
            targetId = parsed.id;
          } catch {
            // ignore
          }
        }

        if (targetId !== undefined && q.ranges) {
          const matchedRange = q.ranges.find(range => range.id === targetId);
          if (matchedRange) {
            matchedValue = JSON.stringify(matchedRange);
          }
        }

        if (matchedValue) {
          initial[q.id] = matchedValue;
        } else {
          initial[q.id] = typeof q.defaultValue === 'object' ? JSON.stringify(q.defaultValue) : q.defaultValue;
        }
      }
      else {
        initial[q.id] = q.defaultValue;
      }
    }
  });
  return initial;
};

export const UserInputsUI = memo(
  /** * @param {UserInputsUIProps} props 
   */
  function UserInputsUI({
    questions,
    groupLabel,
    instructions,
    disabled,
    onChange
  }) {
    // Track previous questions to trigger state reset during render
    const [prevQuestions, setPrevQuestions] = useState(questions);

    const [responses, setResponses] = useState(() => calculateDefaults(questions));

    // Safety check: if questions prop changes, reset state during render
    // This avoids "setState during effect" warnings and prevents double renders
    if (questions !== prevQuestions) {
      setPrevQuestions(questions);
      const newDefaults = calculateDefaults(questions);
      setResponses(newDefaults);
    }

    const onChangeRef = useRef(onChange);
    const hasInteracted = useRef(false);
    const prevFilteredResponsesRef = useRef('');

    // Safely update the ref
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // We do NOT use useEffect to reset responses here anymore.
    // The "if (questions !== prevQuestions)" block above handles it synchronously.
    // However, we still need to reset the interaction trackers.
    useEffect(() => {
      // This effect runs when questions actually change
      hasInteracted.current = Object.keys(calculateDefaults(questions)).length > 0;
      prevFilteredResponsesRef.current = '';
    }, [questions]);

    // Determine visible questions based on dependencies
    const visibleQuestions = useMemo(() => {
      return questions.filter(question => {
        if (!question.dependsOn) return true;

        const { parentQuestionId, requiredVariationID } = question.dependsOn;
        const parentResponse = responses[parentQuestionId];

        if (!parentResponse) return false;
        if (requiredVariationID === null) return true;

        try {
          const parentData = typeof parentResponse === 'string'
            ? JSON.parse(parentResponse)
            : parentResponse;
          return parentData.id === requiredVariationID;
        } catch {
          // ignore
          return false;
        }
      });
    }, [questions, responses]);

    // Notify parent of changes
    useEffect(() => {
      if (hasInteracted.current) {
        const visibleQuestionIds = new Set(visibleQuestions.map(q => q.id));
        const filteredResponses = Object.fromEntries(
          Object.entries(responses).filter(([id]) => visibleQuestionIds.has(id))
        );

        const serialized = JSON.stringify(filteredResponses);
        if (serialized !== prevFilteredResponsesRef.current) {
          prevFilteredResponsesRef.current = serialized;
          if (onChangeRef.current) {
            onChangeRef.current(filteredResponses);
          }
        }
      }
    }, [responses, visibleQuestions]);

    const handleChange = useCallback((questionId, value) => {
      hasInteracted.current = true;
      setResponses(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const renderInput = (question) => {
      const baseInputClasses = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

      switch (question.type) {
        case 'variation':
          return (
            <select
              disabled={disabled}
              value={responses[question.id] ?? ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className={baseInputClasses}
              aria-label={question.questionText}
            >
              <option value="">Select an option...</option>
              {question.options?.map((opt) => {
                const optionValue = JSON.stringify({ display: opt.display, id: opt.id });
                return (
                  <option key={opt.id ?? opt.display} value={optionValue}>
                    {opt.display}
                  </option>
                );
              })}
            </select>
          );

        case 'slab':
          return (
            <select
              disabled={disabled}
              value={responses[question.id] ?? ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className={baseInputClasses}
              aria-label={question.questionText}
            >
              <option value="">Select a range...</option>
              {question.ranges?.map((range) => (
                <option key={range.id ?? `${range.startValue || range.from}-${range.endValue || range.to}`} value={JSON.stringify(range)}>
                  {range.display}
                </option>
              ))}
            </select>
          );

        case 'date':
          return (
            <DateInput
              question={question}
              value={responses[question.id] ?? ''}
              onChange={(value) => handleChange(question.id, value)}
              disabled={disabled}
              baseInputClasses={baseInputClasses}
            />
          );

        case 'quantity':
          return (
            <div className="space-y-1">
              <input
                type="number"
                disabled={disabled}
                min={question.quantityConfig?.min}
                max={question.quantityConfig?.max}
                step={question.quantityConfig?.step ?? 1}
                value={responses[question.id] ?? ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                placeholder={`Enter a number (${question.quantityConfig?.min ?? 0} - ${question.quantityConfig?.max ?? '∞'})`}
                className={baseInputClasses}
                aria-label={question.questionText}
              />
              {question.quantityConfig && (
                <div className="text-xs text-zinc-500">
                  Range: {question.quantityConfig.min} - {question.quantityConfig.max}
                </div>
              )}
            </div>
          );

        case 'text':
          return (
            <textarea
              disabled={disabled}
              value={responses[question.id] ?? ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.textConfig?.placeholder ?? 'Enter your response...'}
              maxLength={question.textConfig?.maxLength}
              rows={3}
              className={`${baseInputClasses} resize-none`}
              aria-label={question.questionText}
            />
          );

        default:
          return null;
      }
    };

    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 space-y-4 my-3">
        {instructions && (
          <div className="text-sm text-zinc-300 pb-2 border-b border-zinc-700">
            {instructions}
          </div>
        )}

        {groupLabel && (
          <h3 className="text-lg font-semibold text-zinc-100">{groupLabel}</h3>
        )}

        {visibleQuestions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              {question.questionText}
              {question.isAdditional && (
                <span className="ml-2 text-xs text-blue-400">(Additional Info)</span>
              )}
              {question.dependsOn && (
                <span className="ml-2 text-xs text-zinc-500">(Conditional)</span>
              )}
            </label>
            {renderInput(question)}
          </div>
        ))}

        {!disabled && (
          <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-700 flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>You can also type additional information in the text input below</span>
          </div>
        )}
      </div>
    );
  }
);

export default UserInputsUI;