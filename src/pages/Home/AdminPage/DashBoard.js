import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area,
} from 'recharts';
import { Button, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RefreshCcw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    const [statistics, setStatistics] = useState(null);
    const [hourAccessData, setHourAccessData] = useState([]);
    const [weekRegisterData, setWeekRegisterData] = useState([]);
    const [weekPostData, setWeekPostData] = useState([]);

    const fetchStatistic = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/statistic`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatistics(response.data.result);
        } catch (err) {
            console.log('Có lỗi khi lấy số liệu', err);
            toast.error('Có lỗi khi lấy số liệu');
        }
    };

    const fetchHourAccessData = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/admin/dashboard/hourly-access`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const apiData = data.result;

            const fullData = Array.from({ length: 24 }, (_, hour) => {
                const found = apiData.find((d) => d.hour === hour);
                return { hour: `${hour}h`, count: found ? found.count : 0 };
            });

            setHourAccessData(fullData);
        } catch (err) {
            toast.error('Có lỗi khi lấy biểu đồ truy cập');
        }
    };

    const fetchWeekRegisterData = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/admin/dashboard/weekly-register`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWeekRegisterData(data.result);
        } catch (err) {
            toast.error('Có lỗi khi lấy biểu đồ truy cập');
        }
    };

    const fetchWeekPostData = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/admin/dashboard/weekly-post`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setWeekPostData(data.result);
        } catch (err) {
            toast.error('Có lỗi khi lấy biểu đồ truy cập');
        }
    };

    useEffect(() => {
        fetchStatistic();
        fetchHourAccessData();
        fetchWeekRegisterData();
        fetchWeekPostData();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCcw size={18} /> Làm mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Người dùng hôm nay */}
                {statistics?.loginUserPerDay && (
                    <Card className="shadow-md hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                            <p className="text-gray-500">Người dùng hôm nay</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">{statistics.loginUserPerDay.quantity}</h3>
                                <div
                                    className={`flex items-center gap-1 ${
                                        statistics.loginUserPerDay.isIncreased ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {statistics.loginUserPerDay.isIncreased ? (
                                        <ArrowUpRight size={18} />
                                    ) : (
                                        <ArrowDownRight size={18} />
                                    )}
                                    <span>{statistics.loginUserPerDay.percentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Người dùng mới tuần này */}
                {statistics?.registerUserPerWeek && (
                    <Card className="shadow-md hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                            <p className="text-gray-500">Người dùng mới tuần này</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">{statistics.registerUserPerWeek.quantity}</h3>
                                <div
                                    className={`flex items-center gap-1 ${
                                        statistics.registerUserPerWeek.isIncreased ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {statistics.registerUserPerWeek.isIncreased ? (
                                        <ArrowUpRight size={18} />
                                    ) : (
                                        <ArrowDownRight size={18} />
                                    )}
                                    <span>{statistics.registerUserPerWeek.percentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Bài viết tuần này */}
                {statistics?.postPerWeek && (
                    <Card className="shadow-md hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                            <p className="text-gray-500">Bài viết tuần này</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">{statistics.postPerWeek.quantity}</h3>
                                <div
                                    className={`flex items-center gap-1 ${
                                        statistics.postPerWeek.isIncreased ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {statistics.postPerWeek.isIncreased ? (
                                        <ArrowUpRight size={18} />
                                    ) : (
                                        <ArrowDownRight size={18} />
                                    )}
                                    <span>{statistics.postPerWeek.percentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {statistics?.reportPerWeek && (
                    <Card className="shadow-md hover:shadow-lg transition-all border border-red-300">
                        <CardContent className="p-4">
                            <p className="text-red-500">Báo cáo vi phạm</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold text-red-500">{statistics.reportPerWeek.quantity}</h3>
                                <div
                                    className={`flex items-center gap-1 ${
                                        statistics.reportPerWeek.isIncreased ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {statistics.reportPerWeek.isIncreased ? (
                                        <ArrowUpRight size={18} />
                                    ) : (
                                        <ArrowDownRight size={18} />
                                    )}
                                    <span>{statistics.reportPerWeek.percentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <h3 className="text-xl font-semibold mb-2">Biểu đồ truy cập trong ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourAccessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            <h3 className="text-xl font-semibold mt-8 mb-2">Số người dùng đăng ký trong tuần</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weekRegisterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>

            <h3 className="text-xl font-semibold mt-8 mb-2">Số bài đăng trong tuần</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weekPostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Dashboard;
