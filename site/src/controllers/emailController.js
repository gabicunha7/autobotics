const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.enviarEmail = async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;

    if (!email || !mensagem) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const msg = {
      to: ['autobotics.sptech@gmail.com', email],
      from: 'kaua.medeiros@sptech.school', 
      subject: `Mensagem de ${nome || 'Autobotics'}`,
      text: mensagem,
      html: `<h2>Mensagem da Autobotics</h2>
             <p><strong>Olá, </strong> ${nome}! Recebemos o e-mail que você enviou referente à mensagem:</p>
             <p>"${mensagem}"</p>
             <p><strong>Entraremos em contato em breve!`
    };

    await sgMail.send(msg);

    res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.response ? error.response.body : error);
    res.status(500).json({ success: false, message: 'Erro ao enviar e-mail', error: error.message });
  }
};
