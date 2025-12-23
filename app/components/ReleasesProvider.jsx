import React, { createContext } from 'react';

const ReleasesContext = createContext();

export function ReleaseProvider({ children }) {
  const [releases, setReleases] = React.useState([]);
  // Hover tooltip state for Release markers (HTML rendered above the chart wrapper)
  const [releaseTip, setReleaseTip] = React.useState({
    commit: null,
    show: false,
    x: 0,
    y: 0,
  });

  const commitsByTs = releases.reduce((acc, curr) => {
    const ts = new Date(curr.timestamp).getTime();
    acc[ts] = curr;
    return acc;
  }, {});

  // Fetch release data from the server
  React.useEffect(() => {
    fetch('/api/release-commits')
      .then(resp => resp.json())
      .then(data => {
        setReleases(data);
      });
  }, []);

  return (
    <ReleasesContext.Provider
      value={{ releases, setReleases, releaseTip, setReleaseTip, commitsByTs }}
    >
      {children}
    </ReleasesContext.Provider>
  );
}

export function useReleases() {
  const context = React.useContext(ReleasesContext);
  if (!context) {
    throw new Error('useReleases must be used within a ReleaseProvider');
  }
  return context;
}
