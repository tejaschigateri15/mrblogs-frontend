import React from 'react';
import { Dialog, DialogContent, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faGlobe, faTimes } from '@fortawesome/free-solid-svg-icons';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '400px',
    maxWidth: '90%',
    backgroundColor: '#FAFAFA', // Light background for the dialog
    color: '#333333', // Dark text for better contrast
  },
}));

const IconWrapper = styled(Box)({
  backgroundColor: '#333333', // Dark background for the icon
  color: '#FAFAFA', // Light color for the icon
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
  color: '#333333', // Dark color for the close button
  minWidth: 'auto',
});

const ActionButton = styled(Button)(({ color }) => ({
  borderRadius: '25px',
  padding: '8px 32px',
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: color === 'primary' ? '#333333' : '#E0E0E0', // Dark for primary, light gray for secondary
  color: color === 'primary' ? '#FAFAFA' : '#333333', // Light text for primary, dark for secondary
  '&:hover': {
    backgroundColor: color === 'primary' ? '#555555' : '#C0C0C0', // Slightly darker on hover
  },
}));

const PrivateToggleDialog = ({ isOpen, onClose, onConfirm, isPrivate }) => {
  return (
    <StyledDialog open={isOpen} onClose={onClose}>
      <CloseButton onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <IconWrapper>
            <FontAwesomeIcon icon={isPrivate ? faGlobe : faLock} size="2x" />
          </IconWrapper>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="#333333">
            {isPrivate ? 'Make Blog Public?' : 'Make Blog Private?'}
          </Typography>
          <Typography variant="body1" paragraph color="#555555">
            {isPrivate
              ? "Your blog will be visible to everyone. This action will make your content accessible to the public."
              : "Only you will be able to see this blog. This action will hide your content from public view."}
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between" width="100%">
            <ActionButton onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton color="primary" onClick={onConfirm}>
              {isPrivate ? 'Make Public' : 'Make Private'}
            </ActionButton>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default PrivateToggleDialog;