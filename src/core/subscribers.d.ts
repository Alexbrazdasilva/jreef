type TSubscribers = Set<() => void>;

interface TNotifier {
  notify<T extends object>($states: Readonly<T>): () => void;
}

export function defineNotifier(subscribers: TSubscribers): TNotifier;
