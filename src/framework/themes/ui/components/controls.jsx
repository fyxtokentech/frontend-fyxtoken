import React from "react";
import { Tooltip } from "@mui/material";

export function WaitSkeleton({ loading = false, simpleOnload = true, ...rest }) {
  loading = +!!loading;
  const body = <div {...rest} />;
  if (simpleOnload && !loading) {
    return body;
  }
  return (
    <div className={["", "titiling pointer-progress"][loading]}>
      <div className={["", "ghost filtering halfgray brightness-1-5"][loading]}>
        {body}
      </div>
    </div>
  );
}

export function TooltipGhost(props) {
  return <Tooltip placement="bottom" arrow {...props} PopperProps={{ sx: { pointerEvents: "none" } }} />;
}
