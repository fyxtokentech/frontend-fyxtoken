import { Box, Typography } from "@mui/material";

export function TitleTab({
  title,
  subtitle,
  variant = "h4",
  _br = true,
}) {
  return (
    <>
      <Box>
        <Typography variant={variant}>{title}</Typography>
        {subtitle && (
          <>
            {_br && <br />}
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </>
        )}
      </Box>
      {_br && <br />}
      <hr />
    </>
  );
}
