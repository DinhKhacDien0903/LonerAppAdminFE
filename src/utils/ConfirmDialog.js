import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const ConfirmLogoutDialog = ({ open, onClose, onConfirm, content }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.2rem' }}>
                Thông báo
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', py: 2, fontSize: '1rem', color: 'text.secondary' }}>
                {content}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button onClick={onClose} variant="outlined">Hủy</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Đồng ý</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmLogoutDialog;
