import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  onShow: boolean;
  onClose: (data: any) => void;
  onConfirm: () => void;
  title?: string;
  content?: any;
  SubmitButtonText?: any;
};

export default function Warning({
  onShow,
  onClose,
  onConfirm,
  title,
  content,
  SubmitButtonText,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [_title, setTitle] = React.useState("");

  React.useEffect(() => {
    setTitle(title || "Warning");
  }, [title]);

  React.useEffect(() => {
    setOpen(onShow);
  }, [onShow]);

  const handleClose = () => {
    setOpen(false);
    onClose?.(false);
  };

  const handleConfirm = (e:any) => {
    e.preventDefault();
    // setOpen(false);
    // onClose?.(true);
    onConfirm?.();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="text-center"
      >
        <form onSubmit={handleConfirm}>
          <DialogTitle id="alert-dialog-title">
            {_title || "Confirmation"}
          </DialogTitle>
          <DialogContent>
            {content || "Check one more time before you proceed."}
          </DialogContent>
          <DialogActions>
            <Button type="submit" autoFocus>
              {SubmitButtonText || "Submit"}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
