export default text => {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.focus();
  el.setSelectionRange(0, text.length);
  document.execCommand("copy");
  document.body.removeChild(el);
};
