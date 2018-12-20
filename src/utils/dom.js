export const q = (selector, context = document) => context.querySelector(selector);
export const qAll = (selector, context = document) => context.querySelectorAll(selector);

export const canUseDOM = !!((typeof window !== 'undefined' && window.document && window.document.createElement));
