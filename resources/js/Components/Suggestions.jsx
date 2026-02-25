import { useEffect, useState } from 'react';

const DefaultSuggestionWrapper = ({ suggestion }) => <span>{suggestion}</span>;

export default function Suggestions({ searchTerm
  , SuggestionWrapper = DefaultSuggestionWrapper
  , useSuggestions }){
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const suggested = useSuggestions(debouncedSearchTerm);

  // debouncing...
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (!suggested.length) {
    return null; // or any other fallback UI when there are no suggestions
  }

  return (
    <span>
      <br />Suggested: {suggested.map((value, index) => {
        const comma = index < suggested.length - 1 ? ', ' : '';
        const suggestionItem = <SuggestionWrapper suggestion={value} />;
        return <span key={index}>{suggestionItem}{comma}</span>;
      })}
    </span>
  );
};