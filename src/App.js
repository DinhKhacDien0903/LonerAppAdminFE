import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { SetupInterceptors } from '~/utils/axios';
import { getMyInfoService } from '~/services/userServices';
import * as actions from '~/redux/actions';
import signalRClient from '~/components/Post/signalRClient';
import { openChatsSelector, userInfoSelector } from '~/redux/selectors';
import ChatPopup from '~/components/ChatPopup';
import ChatGroupPopup from '~/components/ChatGroupPopup';
import { getAllEmotionsService } from '~/services/postServices';
import HomePageAdmin from '~/pages/Home/AdminPage/HomePageAdmin';
import Login from '~/pages/Login';
import 'react-toastify/dist/ReactToastify.css';

function NavigateFunctionComponent() {
    let navigate = useNavigate();
    const [ran, setRan] = useState(false);

    if (!ran) {
        SetupInterceptors(navigate);
        setRan(true);
    }
    return <></>;
}

function App() {
    const openChats = useSelector(openChatsSelector);
    const userInfo = useSelector(userInfoSelector);
    const [notificationConnection, setNotificationConnection] = useState(null);

    // useEffect(() => {
    //     const connectNotificationHub = async () => {
    //         const connection = new HubConnectionBuilder()
    //             .withUrl('https://localhost:7072/notification')
    //             .withAutomaticReconnect()
    //             .build();

    //         try {
    //             await connection.start();
    //             setNotificationConnection(connection);
    //         } catch (error) {
    //             console.error('Notification Hub Connection Failed:', error);
    //         }
    //     };

    //     connectNotificationHub();

    //     return () => {
    //         if (notificationConnection) {
    //             notificationConnection.stop();
    //         }
    //     };
    // }, []);
    return (
        <FetchAllEmotionsPost>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/*" element={<HomePageAdmin />} />
                </Routes>
                <NavigateFunctionComponent />
                <FetchUserInfo />
            </BrowserRouter>
        </FetchAllEmotionsPost>
    );
}

function FetchUserInfo() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const res = (await getMyInfoService()).userDetail;
                dispatch(
                    actions.saveUserInfo({
                        id: res?.id ?? "",
                        userName: res?.userName ?? "",
                        email: res?.email ?? "",
                        phoneNumber: res?.phoneNumber ?? "",
                        about: res?.about ?? "",
                        avatarUrl: res?.avatarUrl ?? "",
                        address: res?.address ?? "",
                        university: res?.university ?? "",
                        work: res?.work ?? "",
                        isActive: res?.isActive ?? false,
                        gender: res?.gender ?? false,
                        age: res?.age ?? 0,
                        dateOfBirth: res?.dateOfBirth ?? "",
                    }),
                );
            } catch (error) {
                console.log(error);
            }
        };

        if (location.pathname.toLowerCase() !== '/login') {
            fetchPersonalInfo();
        }
        signalRClient.start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export const EmotionsTypeContext = createContext(null);

function FetchAllEmotionsPost({ children }) {
    const [emotionsType, setEmotionsType] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllEmotionsService();
                setEmotionsType(
                    res?.map((item) => ({
                        id: item?.emotionTypeID,
                        name: item?.emotionName,
                    })),
                );
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return <EmotionsTypeContext.Provider value={emotionsType}>{children}</EmotionsTypeContext.Provider>;
}

export default App;
