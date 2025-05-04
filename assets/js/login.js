// Função de login
let campo_email;
let campo_senha;
let emailCorreto = '123@gmail.com';
let senhaCorreta = '123';

function entrar() {
    event.preventDefault();
    campo_email = document.getElementById("email").value;
    campo_senha = document.getElementById("senha").value;
    if (campo_email == emailCorreto && campo_senha == senhaCorreta) {
        alert("Login realizado com sucesso!");
        window.location.href = "./dashboard";
    } else {
        alert("Email ou senha incorretos!");
    }
}