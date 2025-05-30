import clsx from 'clsx';
import styles from './Notification.module.scss';
import { useEffect, useState } from 'react';
import {
    getNotificationsService,
    getNotificationsTypeService,
    getNotificationsUserService,
} from '~/services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsOtherSelector, userInfoSelector } from '~/redux/selectors';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { Button } from 'react-bootstrap';
import { timeDifferenceFromNow } from '~/utils/commonUtils';
import { Link } from 'react-router-dom';
import {
    acceptFriendshipService,
    refuseFriendRequestService,
    readNotidicationService,
} from '~/services/relationshipServices';
import * as actions from '~/redux/actions';
import signalRClient from '../Post/signalRClient';

const Notification = ({ notificationRef, showNotification, setShowNotification }) => {
    const dispatch = useDispatch();
    const notificationsOther = useSelector(notificationsOtherSelector);
    const [notificationsType, setNotificationsType] = useState([]);
    const userInfo = useSelector(userInfoSelector);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                var res = await getNotificationsUserService();
                const notifications = res.data;
                setNotificationsType(notifications);
                dispatch(actions.setNotificationsOther(notifications));
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        try {
            signalRClient.on('FriendRequestNotification', (notification) => {
                dispatch(actions.addNotificationOther(notification));
            });
        } catch (error) {
            console.error('Error connecting to SignalR:', error);
        }

        return () => {
            signalRClient.off('FriendRequestNotification');
        };
    }, [dispatch]);

    useEffect(() => {
        signalRClient.on('CancelUser', (notificationId) => {
            dispatch(actions.removeNotificationOther(notificationId));
        });

        return () => {
            signalRClient.off('CancelUser');
        };
    }, []);

    const handleAcceptFriendship = async ({ notificationId, senderId }) => {
        try {
            await acceptFriendshipService(senderId);
            dispatch(actions.removeNotificationOther(notificationId));
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefuseFriendRequest = async ({ notificationId, senderId }) => {
        try {
            await refuseFriendRequestService(senderId);
            dispatch(actions.removeNotificationOther(notificationId));
        } catch (error) {
            console.log(error);
        }
    };

    const handleReadNotification = async (notificationId) => {
        try {
            await readNotidicationService(notificationId);
            dispatch(actions.removeNotificationOther(notificationId));
        } catch (error) {
            console.error('Error reading notification:', error);
        }
    };
    return (
        <div
            ref={notificationRef}
            className={clsx(styles['notification-wrapper'], {
                [styles['show-notification']]: showNotification,
            })}
        >
            {notificationsOther?.length > 0 ? (
                notificationsOther?.map((notification) => {
                    return (
                        <div key={`notification-${notification?.id}`} className={clsx(styles['notification-item'])}>
                            <Link to={`/profile/${notification?.senderId}`}>
                                <img
                                    className={clsx(styles['notification-avatar'])}
                                    src={notification?.avatarUrl || defaultAvatar}
                                />
                            </Link>
                            <div
                                className={clsx(styles['notification-content-time'])}
                                onClick={() => handleReadNotification(notification?.id)}
                            >
                                <div
                                    className={clsx(styles['notification-content'])}
                                    dangerouslySetInnerHTML={{ __html: notification?.message }}
                                ></div>
                                <div className={clsx(styles['notification-time'])}>
                                    {timeDifferenceFromNow(notification?.createdAt)}
                                </div>

                                {notification?.type === 2 && (
                                    <div className="mt-2">
                                        <Button
                                            className="fz-16 me-3"
                                            size="lg"
                                            variant="primary"
                                            onClick={() =>
                                                handleAcceptFriendship({
                                                    notificationId: notification?.id,
                                                    senderId: notification?.senderId,
                                                })
                                            }
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            className="fz-16"
                                            size="lg"
                                            variant="light"
                                            onClick={() =>
                                                handleRefuseFriendRequest({
                                                    notificationId: notification?.id,
                                                    senderId: notification?.senderId,
                                                })
                                            }
                                        >
                                            Xoá
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="fz-16 text-center pt-3 pb-3">Bạn không có thông báo nào</div>
            )}
        </div>
    );
};

export default Notification;
