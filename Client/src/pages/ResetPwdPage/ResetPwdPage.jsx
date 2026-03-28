import React, { useRef, useState } from 'react'
import styles from './ResetPwdPage.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useResetPwdMutation } from '../../queries/requestResetPwdMutation';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ResetPwdPage = () => {
    const token = new URLSearchParams(location.search).get("token");
    const [showPassword, setShowPassword] = useState(false);
    const [pass, setPass] = useState("");
    const confirmPwdRef = useRef(null);
    const handleChange = (e) => {
        setPass(e.target.value);
    }

    const handleConfirmPwdChange = (e) => {
        if((e.target.value).length == 0){
            confirmPwdRef.current.classList.remove(`${styles.pwdMatch}`);
            confirmPwdRef.current.classList.remove(`${styles.pwdNotMatch}`);
        }
        else if (pass != e.target.value && e.target.value) {
            confirmPwdRef.current.classList.add(`${styles.pwdNotMatch}`);
            confirmPwdRef.current.classList.remove(`${styles.pwdMatch}`);
        }
        else if(pass == e.target.value && e.target.value){
            confirmPwdRef.current.classList.remove(`${styles.pwdNotMatch}`);
            confirmPwdRef.current.classList.add(`${styles.pwdMatch}`);
        }
    }

    const { mutate, isPending } = useResetPwdMutation(token);

    const togglePassword = () => setShowPassword((s) => !s);

    const handleReset = (e) => {
        e.preventDefault();
        
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!strongPasswordRegex.test(pass)) {
            toast.error("Password is weak");
            return;
        }

        if (!pass.trim()) {
            toast.error("Please, enter a password");
            return;
        }
        const payload = {password: pass.trim() };
        mutate(payload)
    }
    return (
        <>
            <title>Student Portfolio — Reset Password</title>
            <div className={styles.resetPwdPage}>
                <h2 className={styles.heading}>Student Portfolio — Reset Password</h2>
                <p className={styles.pwdRequirement}>Password must be 8+ characters with uppercase, lowercase, number, and special character.</p>
                <form onSubmit={handleReset}>
                    <label htmlFor="password">New Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className={`${styles.formInput} ${styles.loginInput} ${styles.passwordInput}`}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={pass.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className={styles.eyeButton} onClick={togglePassword}>
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            ref={confirmPwdRef}
                            id="confirmPassword"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className={`${styles.formInput} ${styles.loginInput} ${styles.passwordInput}`}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={pass.password}
                            onChange={handleConfirmPwdChange}
                            required
                        />
                        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className={styles.eyeButton} onClick={togglePassword}>
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    <button disabled={isPending} type="submit" className={`${styles.button} ${styles.saveButton} ${styles.fullWidth}`}>{isPending ? "Resetting..." : "Reset"}</button>
                </form>
            </div>
        </>
    )
}

export default ResetPwdPage
