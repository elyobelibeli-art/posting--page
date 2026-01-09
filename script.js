// Seletores dos elementos do formulário
const postForm = document.getElementById('post-form');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const titleCharCount = document.getElementById('title-char-count');
const contentCharCount = document.getElementById('content-char-count');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');

// Seletores para renderização
const postsContainer = document.getElementById('posts-container');
const noPostsMessage = document.getElementById('no-posts-message');
const loadingIndicator = document.getElementById('loading-indicator');

// Seletores do modal
const successModal = document.getElementById('success-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalOkBtn = document.getElementById('modal-ok-btn');
const modalPostTitle = document.getElementById('modal-post-title');
const modalPostContent = document.getElementById('modal-post-content');
const modalPostId = document.getElementById('modal-post-id');

// URL da API
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Estado da aplicação
let posts = [];

// Contador de caracteres para título
postTitleInput.addEventListener('input', function() {
    const currentLength = this.value.length;
    const maxLength = this.getAttribute('maxlength');
    titleCharCount.textContent = `${currentLength}/${maxLength} caracteres`;
    
    // Mudar cor se estiver perto do limite
    if (currentLength > maxLength * 0.9) {
        titleCharCount.style.color = '#ef4444';
    } else if (currentLength > maxLength * 0.7) {
        titleCharCount.style.color = '#f59e0b';
    } else {
        titleCharCount.style.color = '#94a3b8';
    }
});

// Contador de caracteres para conteúdo
postContentInput.addEventListener('input', function() {
    const currentLength = this.value.length;
    const maxLength = this.getAttribute('maxlength');
    contentCharCount.textContent = `${currentLength}/${maxLength} caracteres`;
    
    // Mudar cor se estiver perto do limite
    if (currentLength > maxLength * 0.9) {
        contentCharCount.style.color = '#ef4444';
    } else if (currentLength > maxLength * 0.7) {
        contentCharCount.style.color = '#f59e0b';
    } else {
        contentCharCount.style.color = '#94a3b8';
    }
});

// Botão limpar
clearBtn.addEventListener('click', function() {
    postTitleInput.value = '';
    postContentInput.value = '';
    titleCharCount.textContent = '0/100 caracteres';
    contentCharCount.textContent = '0/500 caracteres';
    titleCharCount.style.color = '#94a3b8';
    contentCharCount.style.color = '#94a3b8';
    
    // Dar foco no título
    postTitleInput.focus();
});

// Envio do formulário
postForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validação básica
    if (!postTitleInput.value.trim() || !postContentInput.value.trim()) {
        alert('Por favor, preencha tanto o título quanto o conteúdo do post.');
        return;
    }
    
    // Desabilitar botão enquanto envia
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Criar objeto com os dados do post
        const data = {
            title: postTitleInput.value,
            body: postContentInput.value,
            userId: 1
        };
        
        // Configurar a requisição
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        
        // Verificar se a requisição foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        // Obter resposta da API
        const postData = await response.json();
        
        // Adicionar post à lista local
        posts.unshift(postData);
        
        // Limpar formulário
        postTitleInput.value = '';
        postContentInput.value = '';
        titleCharCount.textContent = '0/100 caracteres';
        contentCharCount.textContent = '0/500 caracteres';
        titleCharCount.style.color = '#94a3b8';
        contentCharCount.style.color = '#94a3b8';
        
        // Atualizar a exibição dos posts
        renderPosts();
        
        // Mostrar modal de sucesso
        showSuccessModal(postData);
        
    } catch (error) {
        console.error('Erro ao enviar post:', error);
        alert('Ocorreu um erro ao tentar publicar seu post. Por favor, tente novamente.');
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar Post';
    }
});

// Função para mostrar o modal de sucesso
function showSuccessModal(postData) {
    modalPostTitle.textContent = postData.title;
    modalPostContent.textContent = postData.body;
    modalPostId.textContent = postData.id;
    successModal.classList.add('active');
    
    // Focar no botão OK do modal para acessibilidade
    setTimeout(() => {
        modalOkBtn.focus();
    }, 100);
}

// Função para fechar o modal
function closeModal() {
    successModal.classList.remove('active');
}

// Event listeners para fechar modal
modalCloseBtn.addEventListener('click', closeModal);
modalOkBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora dele
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// Função para renderizar os posts
function renderPosts() {
    // Esconder mensagem de "nenhum post" se houver posts
    if (posts.length > 0) {
        noPostsMessage.style.display = 'none';
    } else {
        noPostsMessage.style.display = 'block';
    }
    
    // Limpar container
    postsContainer.innerHTML = '';
    
    // Adicionar cada post
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Função para criar elemento de post
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    
    // Formatar conteúdo (substituir quebras de linha por <br>)
    const formattedContent = post.body.replace(/\n/g, '<br>');
    
    postDiv.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${post.title}</h3>
            <span class="post-id">ID: ${post.id}</span>
        </div>
        <div class="post-content">${formattedContent}</div>
        <div class="post-footer">
            <div class="post-user">
                <i class="fas fa-user"></i>
                <span>Usuário ID: ${post.userId}</span>
            </div>
            <div class="post-date">
                <i class="far fa-clock"></i>
                <span>Publicado agora</span>
            </div>
        </div>
    `;
    
    return postDiv;
}

// Função para carregar posts existentes (simulação)
function loadExistingPosts() {
    // Simular carregamento
    setTimeout(() => {
        // Exemplo de posts iniciais (vamos simular com alguns posts da API)
        fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
            .then(response => response.json())
            .then(data => {
                // Adicionar posts ao array
                posts = [...data.slice(0, 2)];
                
                // Esconder indicador de carregamento
                loadingIndicator.style.display = 'none';
                
                // Renderizar posts
                renderPosts();
            })
            .catch(error => {
                console.error('Erro ao carregar posts:', error);
                loadingIndicator.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar posts. Tente novamente mais tarde.</p>
                `;
            });
    }, 1000);
}

// Inicializar aplicação
function initApp() {
    // Carregar posts existentes
    loadExistingPosts();
    
    // Dar foco no campo de título
    postTitleInput.focus();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);
