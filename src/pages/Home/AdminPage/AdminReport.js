import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Pagination,
} from '@mui/material';
import { formatMessageTime } from '../../../utils/timeFormatter';
import ConfirmLogoutDialog from '../../../utils/ConfirmDialog';
import { getAllReportsAsync, deleteReportAsync } from '../../../services/userServices';
import { HubConnectionBuilder } from '@microsoft/signalr';

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        reportedPostCaption: '',
        reportedUsername: '',
        senderUsername: '',
    });
    const token = localStorage.getItem('token');
    const [deletedReportId, setDeletedReportId] = useState();
    const [currentReport, setCurrentReport] = useState();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmSendReportDialog, setOpenConfirmSendReportDialog] = useState(false);
    const [conn, setConn] = useState('');

    const fetchReport = async () => {
        try {
            const res = await getAllReportsAsync(filters.senderUsername, filters.reportedUsername, filters.reportedPostCaption, page, 30);
            console.log('Dữ liệu báo cáo:', res.data);
            setReports(res.data.items || []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Có lỗi khi lấy danh sách báo cáo');
        }
    };

    useEffect(() => {
        fetchReport();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchReport();
    };

    const handleDeleteReport = async (reportId) => {
        try {
            var result = await deleteReportAsync({ resolverId: "dsaa", reportId });
            if (result.isSuccess)
                toast.success(result.message);
            else
                toast.error(result.message);
            fetchReport();
            setOpenConfirmDialog(false);
        } catch (err) {
            toast.error('Lỗi khi xóa báo cáo');
            console.log('Lỗi khi xóa báo cáo', err);
        }
    };

    const handleSendReportToUserAsync = async (report) => {
        try {
            var notificationParameter = {
                receiverId: report?.reportedId,
                content: `Bạn đã nhận được cảnh báo về ${report.reason}`,
                images: ""
            };
            var result = await conn.invoke('SendWarningNotificationReportToUser', notificationParameter);
            if (result)
                toast.success("Gửi cảnh báo thành công!");
            else
                toast.error("Gửi cảnh báo thất bại!");
            fetchReport();
            setOpenConfirmSendReportDialog(false);
        } catch (err) {
            toast.error('Lỗi khi gửi cảnh báo');
            console.log('Lỗi khi xóa cảnh báo', err);
        }
    };

    useEffect(() => {
        const connection = new HubConnectionBuilder().withUrl('https://localhost:7165/notification').build();

        const startConnection = async () => {
            try {
                await connection.start();

                setConn(connection);

                connection.on('UserNotConnected', (errorMessage) => {
                    setError(errorMessage);
                    console.error('Error received: ', errorMessage);
                });
            } catch (error) {
                console.error('Error establishing connection:', error);
            }
        };

        startConnection();
        return () => {
            if (connection) {
                connection.stop();
                console.log('Connection closed');
            }
        };
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quản lý báo cáo người dùng</h2>

            <div className="flex gap-4 mb-4">
                <TextField
                    label="Lý do báo cáo"
                    size="small"
                    value={filters.reportedPostCaption}
                    onChange={(e) => setFilters({ ...filters, reportedPostCaption: e.target.value })}
                />
                <TextField
                    label="Người bị báo cáo"
                    size="small"
                    value={filters.reportedUsername}
                    onChange={(e) => setFilters({ ...filters, reportedUsername: e.target.value })}
                />
                <TextField
                    label="Người gửi báo cáo"
                    size="small"
                    value={filters.senderUsername}
                    onChange={(e) => setFilters({ ...filters, senderUsername: e.target.value })}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Lý do</TableCell>
                            <TableCell>Mô tả thêm</TableCell>
                            <TableCell>Người bị báo cáo</TableCell>
                            <TableCell>Người gửi</TableCell>
                            <TableCell>Gửi cảnh báo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report, index) => (
                            <TableRow key={report.reportId}>
                                <TableCell>{page * 30 + index + 1}</TableCell>
                                <TableCell>{formatMessageTime(report.createdAt)}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>{report.moreInformation || 'N/A'}</TableCell>
                                <TableCell>{report.repotedName}</TableCell>
                                <TableCell>{report.repoterName}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        onClick={() => {
                                            setCurrentReport(report);
                                            setOpenConfirmSendReportDialog(true);
                                        }}
                                    >
                                        Gửi cảnh báo
                                    </Button></TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                            setDeletedReportId(report.id);
                                            setOpenConfirmDialog(true);
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4 flex justify-end">
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(e, value) => setPage(value - 1)}
                    color="primary"
                />
            </div>
            <ConfirmLogoutDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={() => handleDeleteReport(deletedReportId)}
                content={'Bạn có chắc chắn muốn xóa báo cáo này không?'}
            />

            <ConfirmLogoutDialog
                open={openConfirmSendReportDialog}
                onClose={() => setOpenConfirmSendReportDialog(false)}
                onConfirm={() => handleSendReportToUserAsync(currentReport)}
                content={'Bạn có chắc chắn muốn gửi cảnh báo không?'}
            />
        </div>
    );
};

export default AdminReport;
