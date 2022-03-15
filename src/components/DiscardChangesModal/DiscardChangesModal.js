import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { Card, IconButton } from '@mui/material';
import PropTypes from "prop-types";
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
/**
 * Opens a non-closable discard changes modal to ask whether the users want to discard their changes
 * @component
 * @param {Object} props 
 * @param {Boolean} props.isOpen whether the dialog modal should be opened or not
 * @param {Function} props.saveChanges function to save changes
 * @param {Function} props.discardChanges function to discard changes
 * @param {Function} props.onClose function to close the dialog, called after saveChanges or discardChanges
 * @returns {JSX.Element} containing a Dialog that asks the user whether to save or discard changes
 * can only be closed via clicking save or discard changes button
 */
function DiscardChangesModal(props) {

   const discardChangesAndCloseDialog = () => {
       props.discardChanges();
       props.closeDialog();
       
   }

   const saveChangesAndCloseDialog = () => {
       props.closeDialog();
       props.saveChanges();
   }

   /**
    * title of the dialog
    * @constant {string}
    */
   const heading = "Discard Changes";

   /**
    * question that is asked to the user
    * @constant {string}
    */
   const dialog = "Are you sure you want to discard all changes?";

    /**
    * Label for the discard changes button
    * @constant {string}
    */
   const discardButtonLabel = "Discard Changes";

    /**
    * Label for the save changes button
    * @constant {string}
    */
   const saveButtonLabel = "Save Changes";

    return (
        <Dialog
            open={props.isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-testid="discardChanges-dialog"
        >
            <Card sx={{backgroundColor: "theme.palette.background.default"}}>
                <CardHeader
                    title={heading}
                    action={
                        <IconButton onClick={props.onClose} aria-label="close" data-testid="DiscardChangedModal-close-modal">
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <DialogContent>
                    <Alert severity="warning" variant="standard" id="alert-dialog-description">
                        {dialog}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={discardChangesAndCloseDialog} data-testid="discardChanges-discardButton">{discardButtonLabel}</Button>
                    <Button onClick={saveChangesAndCloseDialog} data-testid="discardChanges-saveButton" autoFocus>
                        {saveButtonLabel}
                    </Button>
                </DialogActions>
            </Card>
        </Dialog>
    );
}

DiscardChangesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    saveChanges: PropTypes.func.isRequired,
    discardChanges: PropTypes.func.isRequired,
    /**
     * function that handles what happens if the close icon of the dialog is pressed
     */
    onClose: PropTypes.func.isRequired,
    /**
     * function to actually close (hide) the dialog
     */
    closeDialog: PropTypes.func.isRequired,
}

export default DiscardChangesModal;