document.getElementById('enviarEmail').addEventListener('click', async () => {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const mensagem = document.getElementById('mensagem').value;

  try {
    const resposta = await fetch('http://localhost:3333/api/enviar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem })
    });

    const resultado = await resposta.json();
    alert(resultado.message);
  } catch (erro) {
    console.error('Erro ao enviar:', erro);
    alert('Falha ao enviar e-mail.');
  }
});
