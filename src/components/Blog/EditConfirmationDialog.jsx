import React from 'react';
import { Dialog, DialogContent, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '400px',
    maxWidth: '90%',
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
}));

const IconWrapper = styled(Box)({
  backgroundColor: '#4CAF50',
  color: '#FAFAFA',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
});

const CloseButton = styled(Button)({
  position: 'absolute',
  right: '8px',
  top: '8px',
  color: '#333333',
  minWidth: 'auto',
});

const ActionButton = styled(Button)(({ color }) => ({
  borderRadius: '25px',
  padding: '8px 32px',
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: color === 'primary' ? '#4CAF50' : '#E0E0E0',
  color: color === 'primary' ? '#FAFAFA' : '#333333',
  '&:hover': {
    backgroundColor: color === 'primary' ? '#45a049' : '#C0C0C0',
  },
}));

const EditConfirmationDialog = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  return (
    <StyledDialog open={isOpen} onClose={onClose}>
      <CloseButton onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <IconWrapper>
            <FontAwesomeIcon icon={faEdit} size="2x" />
          </IconWrapper>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="#333333">
            Edit Blog
          </Typography>
          <Typography variant="body1" paragraph color="#555555">
            Are you sure you want to edit the blog "{blogTitle}"?
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between" width="100%">
            <ActionButton onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton color="primary" onClick={onConfirm}>
              Edit
            </ActionButton>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default EditConfirmationDialog;