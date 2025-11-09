import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./LoginPage.module.css";
import { useTheme } from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance.utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLoginMutation from "../../queries/loginMutation.queries";
import useAuthQuery from "../../queries/checkAuth.queries";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const {mutate, isPending} = useLoginMutation();
    const {user} = useAuthQuery();

    if (user) {
        navigate('/');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const togglePassword = () => setShowPassword((s) => !s);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email) return toast.error("Please enter your email.");
        if (!form.password) return toast.error("Please enter your password.");

        const payload = { email: form.email.trim(), password: form.password };

        mutate(payload, {
            onSettled: () => setForm({ email: '', password: '' })
        });
    };

    return (
        <>
            <title>Sign In - Student Portfolio</title>
            <button className={styles.headerButton} title='Toggle Theme' onClick={toggleTheme}>{theme === 'light' ? <MdDarkMode /> : <MdLightMode />}</button>
            <div className={styles.loginContainer}>
                <h2 className={styles.heading}>Student Portfolio — Sign In</h2>
                <div className={styles.loginCardDiv}>
                    <img src="/images/login.jpg" alt="login - student portfolio" className={styles.loginImage} />
                    <form className={styles.loginCard} onSubmit={handleSubmit}>
                        <label className={styles.inputLabel} htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={`${styles.formInput} ${styles.loginInput}`}
                            placeholder="yourmail@student.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <label className={styles.inputLabel} htmlFor="password">Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className={`${styles.formInput} ${styles.loginInput} ${styles.passwordInput}`}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className={styles.eyeButton} onClick={togglePassword}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>

                        <button type="submit" disabled={isPending} className={`${styles.button} ${styles.saveButton} ${styles.fullWidth}`}>{isPending ? "Signing In" : "Sign In"}</button>

                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;

