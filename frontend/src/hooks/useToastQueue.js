import { useEffect, useRef, useState } from 'react';

const TOAST_DURATION_MS = 3200;

export function useToastQueue() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => () => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current.clear();
  }, []);

  function dismissToast(id) {
    const timerId = timersRef.current.get(id);

    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function pushToast({ type = 'info', message }) {
    if (!message) {
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((current) => [...current, { id, type, message }]);

    const timerId = window.setTimeout(() => {
      dismissToast(id);
    }, TOAST_DURATION_MS);

    timersRef.current.set(id, timerId);
  }

  return {
    toasts,
    pushToast,
    dismissToast,
  };
}

export function useToastSignal(value, type, pushToast) {
  const previousValueRef = useRef('');

  useEffect(() => {
    if (!value || value === previousValueRef.current) {
      return;
    }

    previousValueRef.current = value;
    pushToast({ type, message: value });
  }, [pushToast, type, value]);
}
