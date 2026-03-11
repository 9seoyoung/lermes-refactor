import { useEffect, useRef, useState } from "react";
import styles from "./SearchBox.module.css";
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
  const [particles, setParticles] = useState([]);

  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);
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

  const createParticlesAtCursor = () => {
    const input = inputRef.current;
    const box = searchBoxRef.current;
    if (!input || !box) return;

    const inputRect = input.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const styles = window.getComputedStyle(input);

    const font = [
      styles.fontStyle,
      styles.fontVariant,
      styles.fontWeight,
      styles.fontSize,
      styles.lineHeight === "normal" ? "" : `/${styles.lineHeight}`,
      styles.fontFamily,
    ]
      .join(" ")
      .trim();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;

    const cursorIndex = input.selectionStart ?? keyword.length;
    const textBeforeCursor = input.value.slice(0, cursorIndex);

    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const textWidth = ctx.measureText(textBeforeCursor).width;

    const x = inputRect.left - boxRect.left + paddingLeft + textWidth - input.scrollLeft;
    const y = inputRect.top - boxRect.top + inputRect.height * 0.8;

    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x,
      y,
      dx: (Math.random() - 0.5) * 60,
      dy: (Math.random() - 0.5) * 40 + 10,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 80,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 700);
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
    createParticlesAtCursor();
  };

  return (
    <div ref={searchBoxRef} className={styles.searchBox}>
      <Search size={18} strokeWidth={2} className={styles.searchIcon} />

      <input
        ref={inputRef}
        className={styles.searchBar}
        type="search"
        value={keyword}
        onChange={handleChange}
        placeholder="원하는 강좌를 찾아보세요"
      />

      {keyword && (
        <button className={styles.clearButton} onClick={() => setKeyword("")} type="button">
          <X size={16} />
        </button>
      )}

      {particles.map((particle) => (
        <span
          key={particle.id}
          className={styles.particle}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            "--dx": `${particle.dx}px`,
            "--dy": `${particle.dy}px`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}

      <ul className={styles.listBox}>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}