import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import "./Model.css";


const InstructionModal = ({
  handleClose,
  open,
  alertMessage,
  instructions,
}) => {
  const instructionLines = instructions.split("\n");

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose(event, reason);
        }
      }}
      aria-describedby="modal-description"
      aria-labelledby="modal-title"
      disableEscapeKeyDown
      BackdropComponent={Backdrop}
      sx={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ padding: '2vh' }}>
            <h5 id="modal-title">Instructions</h5>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
            {alertMessage && (
              <div className="alert-message">{alertMessage}</div>
            )}
            <div className="instructions-text">
              {instructionLines.length > 0 && (
                <>
                  <div style={{ fontWeight: 800 }}>{instructionLines[0]}</div>
                  {instructionLines.slice(1).map((instruction, index) => (
                    <div key={index}>
                      {instruction}
                      <br />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <hr />
          <div class="hstack gap-2 p-2 justify-content-end">
            <button
              className="btn btn-primary create-item-btn"
              onClick={handleClose}
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionModal;
