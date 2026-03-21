window.MFMUtils = {
  qs(selector, scope=document){ return scope.querySelector(selector); },
  qsa(selector, scope=document){ return [...scope.querySelectorAll(selector)]; }
};
