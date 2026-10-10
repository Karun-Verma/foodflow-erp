import { useState, useEffect, useCallback, useRef } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export const usePagination = (items, perPage = 8) => {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const current = items.slice((page - 1) * perPage, page * perPage);
  const next = useCallback(() => setPage(p => Math.min(p + 1, total)), [total]);
  const prev = useCallback(() => setPage(p => Math.max(p - 1, 1)), []);
  const goTo = useCallback((p) => setPage(Math.max(1, Math.min(p, total))), [total]);
  useEffect(() => setPage(1), [items.length]);
  return { current, page, total, next, prev, goTo };
};

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);
  const reset = useCallback(() => { setValues(initialValues); setErrors({}); }, [initialValues]);
  return { values, setValues, errors, setErrors, handleChange, reset };
};

export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback((v) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); }, [key]);
  return [value, set];
};
