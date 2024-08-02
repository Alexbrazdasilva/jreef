export function defineNotifier(subscribers) {
  function notify(states) {
    subscribers.forEach((callBack) => callBack && callBack(states));
  }

  return { notify };
}
