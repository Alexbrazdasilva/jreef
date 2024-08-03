export function defineRenders(SUBSCRIBERS) {
  function render(states, callBack) {
    SUBSCRIBERS.add(callBack);
    callBack && callBack(states);

    return () => SUBSCRIBERS.delete(callBack);
  }

  return { render };
}
