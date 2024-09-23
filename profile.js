// profile.js

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser'));
    
    if (!currentUser) {
        alert('Usuário não encontrado. Você será redirecionado para o login.');
        window.location.href = 'index.html';
        return;
    }

    // Exibir informações do usuário
    document.getElementById('profile-name').textContent = currentUser.name || 'Nome não disponível';
    document.getElementById('profile-username').textContent = `@${currentUser.username}`;
    document.getElementById('profile-bio').textContent = currentUser.description || 'Sem descrição';
    const logoutButton = document.getElementById('logout-button');

    // Carregar imagem de perfil
    const profileAvatarElement = document.getElementById('profile-avatar');
    if (currentUser.profilePic) {
        profileAvatarElement.src = currentUser.profilePic;
    }

    // Carregar imagem de cabeçalho
    const profileCoverElement = document.getElementById('profile-cover');
    if (currentUser.headerImage) {
        profileCoverElement.src = currentUser.headerImage;
    }

    // Exibir contagem de seguidores e seguindo (caso você tenha essas informações no objeto)
    document.getElementById('following-count').textContent = currentUser.followingCount || 0;
    document.getElementById('followers-count').textContent = currentUser.followersCount || 0;

    // Adicionar evento de clique ao botão de logout
    logoutButton.addEventListener('click', () => {
        // Remover informações de login do localStorage e sessionStorage
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUser');
        
        // Remover a propriedade de "mantenha-me conectado"
        localStorage.removeItem('staySignedIn');
        
        // Exibir mensagem de logout bem-sucedido
        alert('Você foi desconectado com sucesso.');
        
        // Redirecionar para a página inicial
        window.location.href = 'index.html';
    });
});