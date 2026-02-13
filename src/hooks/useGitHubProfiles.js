import { useEffect, useState, useRef } from 'react';

export default function useGitHubProfiles({ onComplete } = {}) {
  const [profiles, setProfiles] = useState([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch('/data/friendsData.json')
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        setProfiles(data);
      })
      .catch(() => {
        setProfiles([]);
      })
      .finally(() => {
        onCompleteRef.current?.();
      });
  }, []);

  return profiles;
}
