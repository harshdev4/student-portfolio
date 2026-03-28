import mjml from 'mjml';
import transporter from '../config/nodemailer.config.js';

const sendResetPwdMail = async (id, userMail) => {
    const RESET_LINK = process.env.NODE_ENV === "development"
        ? `http://localhost:5173/request-reset-pwd/${id}`
        : `https://student-digital-portfolio.onrender.com/request-reset-pwd/${id}`;

    const template = `<mjml>
        <mj-head>
            <mj-title>Password Reset</mj-title>
            <mj-preview>Reset your password securely</mj-preview>
            <mj-attributes>
                <mj-all font-family="Arial, sans-serif" />
                <mj-text font-size="16px" color="#333333" />
                <mj-button background-color="#4F46E5" color="#ffffff" border-radius="6px" />
            </mj-attributes>
        </mj-head>

        <mj-body background-color="#f4f4f5">
            <mj-section padding="10px 10px">
                <mj-column>

                    <mj-text font-size="22px" font-weight="bold" align="center">
                        Student-Digital-Portfolio App
                    </mj-text>

                    <mj-section background-color="#ffffff" padding="15px" border-radius="8px">

                        <mj-column>

                            <mj-text font-size="20px" font-weight="bold">
                                Reset your password
                            </mj-text>

                            <mj-text>
                                We received a request to reset your password. Click the button below to set a new password.
                            </mj-text>

                            <mj-button href="${RESET_LINK}">
                                Reset Password
                            </mj-button>

                            <mj-text font-size="14px" color="#666666">
                                This link will expire in 15 minutes for security reasons.
                            </mj-text>

                            <mj-divider border-color="#eeeeee" />

                            <mj-text font-size="13px" color="#999999">
                                If you didn’t request a password reset, you can safely ignore this email.
                            </mj-text>

                        </mj-column>

                    </mj-section>

                    <mj-text align="center" font-size="12px" color="#aaaaaa">
                        © 2026 Student-digital-portfolio App. All rights reserved.
                    </mj-text>

                </mj-column>
            </mj-section>
        </mj-body>
    </mjml>

    `
    const {html} = mjml(template);

    let info = await transporter.sendMail({
        from: `"Student-Digital-Portfolio"<${process.env.MAIL}>`,
        to: userMail,
        subject: 'Password Reset',
        html: html
    })

};

export default sendResetPwdMail;