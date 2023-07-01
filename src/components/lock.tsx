import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import { Tooltip } from "@mui/material"

export default function Lock(props: { locked: boolean }) {
  if (props.locked) {
    return (
      <Tooltip title="This is locked and requires special permissions to be updated">
        <LockOutlinedIcon color="error" fontSize="small" />
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="This is unlocked, update do not require special permissions">
        <LockOpenIcon color="success" fontSize="small" />
      </Tooltip>
    )
  }
}
