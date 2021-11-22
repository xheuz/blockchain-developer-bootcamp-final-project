import React from "react";
import * as jdenticon from 'jdenticon';

export default function Gavatar({ hash = 'random', size = "100%" }) {
  const icon = React.useRef(null);

  React.useEffect(() => {
    jdenticon.update(icon.current, hash);
  }, [hash]);

  return (
    <svg data-jdenticon-value={hash} height={size} ref={icon} width={size} />
  );
}
