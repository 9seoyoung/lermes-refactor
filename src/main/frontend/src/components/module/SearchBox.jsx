import { useEffect, useState } from "react";
import styles from './SearchBox.module.css';
import { Search, X } from "lucide-react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(debouncedKeyword)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [debouncedKeyword]);

  return (
    <div className={styles.searchBox}>
      <Search size={18} strokeWidth={2} className={styles.searchIcon}/>
      <input
        className={styles.searchBar}
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="원하는 강좌를 찾아보세요"
      />
      {keyword && (
        <button onClick={() => setKeyword("")}>
          <X size={16} />
        </button>
      )}
      <ul className="listBox">
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}