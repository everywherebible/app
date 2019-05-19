export const setChapterText = (translation, reference, text) => ({
  type: "set-chapter-text",
  translation,
  reference,
  text,
});

export const addRecent = reference => ({type: "add-recent", reference});

export const setRecents = recents => ({type: "set-recents", recents});

export const enableFocusMode = enabled => ({
  type: "enable-focus-mode",
  enabled,
});

export const enableNightMode = enabled => ({
  type: "enable-night-mode",
  enabled,
});

export const setPreferences = preferences => ({
  type: "set-preferences",
  preferences,
});

export const addToast = text => ({type: "add-toast", text});

export const confirmFocusMode = () => ({type: "confirm-focus-mode"});
