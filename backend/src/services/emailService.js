
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function enviarCodigoRecuperacao(emailDestino, codigo) {
  await transporter.sendMail({
    from: `"uneSUS" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: "Recuperação de senha - uneSUS",
    text: `Seu código de recuperação é: ${codigo}. Ele é válido por 10 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px;">
        <h2 style="color: #0B1756;">uneSUS</h2>
        <p>Olá!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Seu código de recuperação é:</p>
        <h1 style="color: #0B1756; letter-spacing: 8px;">${codigo}</h1>
        <p>Esse código é válido por <strong>10 minutos</strong>.</p>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      </div>
    `
  });
}
