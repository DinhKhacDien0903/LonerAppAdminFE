import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import styles from './Login.module.scss';
import customToastify from '~/utils/customToastify';
import { loginService, verifyOtpService } from '~/services/authServices';
import { getMyInfoService } from '~/services/userServices';
import * as actions from '~/redux/actions';

function Login() {
    const navigate = useNavigate(null);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (localStorage.getItem('isAuthenticated')) {
    //         navigate('/');
    //     }
    // }, []);

    useEffect(() => {
        if (localStorage.getItem('showToastOnLogin')) {
            customToastify.info('Bạn đã hết phiên đăng nhập');
            localStorage.removeItem('showToastOnLogin');
        }
    }, []);

    const [loginInfo, setLoginInfo] = useState({ email: '' });
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [validatedFormLogin, setValidatedFormLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');

    const loginFormRef = useRef(null);
    const signUpFormRef = useRef(null);
    const otpRef = useRef(null);

    const [signUpInfo, setSignUpInfo] = useState({
        email: '',
        otp: '',
    });

    const [showFormSignUp, setShowFormSignUp] = useState(false);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
    const [validatedFormSignUp, setValidatedFormSignUp] = useState(false);
    const [emailExisted, setemailExisted] = useState([]);

    const toggleShowPasswordLogin = () => {
        setShowPasswordLogin(!showPasswordLogin);
    };

    const toggleShowPasswordSignUp = () => {
        setShowPasswordSignUp(!showPasswordSignUp);
    };

    const handleCloseFormSignUp = () => setShowFormSignUp(false);
    const handleShowFormSignUp = () => setShowFormSignUp(true);

    const handleChangeFormLogin = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    const handleSubmitFormLogin = async (e) => {
        try {
            const form = loginFormRef.current;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
                setValidatedFormLogin(true);
                setErrorLogin('Email không đúng định dạng');
            } else {
                var res = await loginService(loginInfo);
                if (res.isSuccess) {
                    setShowFormSignUp(true);
                    setErrorLogin('');
                } else {
                    setErrorLogin(res.Message);
                }
                // const fetchPersonalInfo = async () => {
                //     const res = (await getMyInfoService()).data;
                //     dispatch(
                //         actions.saveUserInfo({
                //             id: res?.id,
                //             firstName: res?.firstName,
                //             lastName: res?.lastName,
                //             age: '18',
                //             avatar: res?.avatarUrl,
                //             address: res?.address,
                //             school: 'Haui',
                //             workplace: 'NewwaveJSC',
                //             role: res?.role,
                //         }),
                //     );
                // };
                // fetchPersonalInfo();
            }
        } catch (error) {
            console.log(error);
            setErrorLogin('Tài khoản hoặc mật khẩu của bạn không chính xác');
        }
    };

    const handleEnterToLogin = (e) => {
        if (e.key === 'Enter') {
            handleSubmitFormLogin(e);
        }
    };

    const handleChangeFormSignUp = (e) => {
        const { name, value } = e.target;
        setSignUpInfo({
            ...signUpInfo,
            [name]: value,
        });
    };

    const handleSubmitFormSignUp = async (e) => {
        try {
            const form = signUpFormRef.current;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
                setValidatedFormSignUp(true);
            } else {
                var res = await verifyOtpService({
                    email: loginInfo.email,
                    otp: signUpInfo.otp,
                });

                if (res.isVerified) {
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                    customToastify.success('Đăng nhập thành công!');

                    setSignUpInfo({
                        otp: '',
                        email: '',
                    });

                    setShowPasswordSignUp(false);
                    setValidatedFormSignUp(false);
                    setShowFormSignUp(false);
                    localStorage.setItem('isAuthenticated', true);
                    navigate('/');
                } else {
                    setemailExisted([...emailExisted, signUpInfo.otp]);
                    customToastify.error('Mã OTP không chính xác hoặc đã hết hạn');
                }
            }
        } catch (error) {
            if (Number(error.status) === 400) {
                setValidatedFormSignUp(true);
                setemailExisted([...emailExisted, signUpInfo.otp]);
            }
        }
    };

    const handleEnterToSignup = (e) => {
        if (e.key === 'Enter') {
            handleSubmitFormSignUp(e);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <div className={clsx('p-4', styles['login-wrapper'])}>
                <Form ref={loginFormRef} noValidate validated={validatedFormLogin}>
                    <Form.Group className="mb-3" as={Col} md="12">
                        <Form.Control
                            value={loginInfo.email}
                            name="email"
                            className="fz-16"
                            type="Email"
                            placeholder="Email"
                            required
                            onKeyUp={handleEnterToLogin}
                            onChange={handleChangeFormLogin}
                        />
                    </Form.Group>
                    {errorLogin && (
                        <div className={clsx('mb-3', styles['invalid-feedback'])}>
                            Tài khoản của bạn không chính xác
                        </div>
                    )}
                </Form>
                <Button className="w-100 fz-16" onClick={handleSubmitFormLogin}>
                    Tiếp theo
                </Button>
                <div className={clsx('d-flex justify-content-center', styles['sign-up-wrapper'])}>
                    <Modal show={showFormSignUp} onHide={handleCloseFormSignUp}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <div className={clsx(styles['modal-sign-up-title'])}>Nhập mã OTP</div>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form ref={signUpFormRef} noValidate validated={validatedFormSignUp}>
                                <Form.Group className="mb-3" as={Col} md="12">
                                    <Form.Control
                                        maxLength={6}
                                        max={6}
                                        ref={otpRef}
                                        value={signUpInfo.otp}
                                        type="text"
                                        pattern="\d*"
                                        inputMode="numeric"
                                        name="otp"
                                        className={clsx('fz-16', {
                                            [styles['invalid']]: emailExisted.includes(signUpInfo.otp),
                                        })}
                                        placeholder="Mã OTP"
                                        required
                                        onKeyUp={handleEnterToSignup}
                                        isInvalid={emailExisted.includes(signUpInfo.otp)}
                                        onChange={handleChangeFormSignUp}
                                    />
                                    {emailExisted.includes(signUpInfo.otp) && (
                                        <Form.Control.Feedback className="fz-16" type="invalid">
                                            OTP không chính xác hoặc đã hết hạn
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className={clsx('fz-16', styles['sign-up-btn'])} onClick={handleSubmitFormSignUp}>
                                Đăng nhập
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Login;
