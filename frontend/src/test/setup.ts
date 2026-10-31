import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '../lib/i18n';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom does not implement these browser APIs.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
  };
}
