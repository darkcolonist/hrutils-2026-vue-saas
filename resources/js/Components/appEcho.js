import { useEffect
  // , useRef
} from 'react';

export function useEchoListener({channel, event, callback,
  isPrivate = false
}) {
  useEffect(() => {
    const internalChannel = isPrivate
      ? Echo.private(channel)
      : Echo.channel(channel);

    internalChannel.listen(event, (e) => {
      callback(e);
    });

    return () => {
      internalChannel.stopListening(event);
    };
  }, []);
}