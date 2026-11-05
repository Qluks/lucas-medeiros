# Portfólio de Lucas Medeiros

Portfólio responsivo de Lucas Marcos de Medeiros, desenvolvido com HTML, CSS e JavaScript, sem dependências ou etapa de build.

## Como visualizar

Como o site consulta os indicadores públicos dos repositórios na API do GitHub, abra-o por HTTP em vez de `file://`. Na pasta do projeto, inicie um servidor estático, por exemplo:

```powershell
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` publica automaticamente o conteúdo estático deste repositório no GitHub Pages após cada push para `main`:

1. Crie no GitHub o repositório público `Qluks/lucas-medeiros`.
2. Envie para ele os arquivos do site (`index.html`, `styles.css`, `script.js`, `README.md`, `.nojekyll` e `.github/workflows/deploy.yml`).
3. Em **Settings → Pages**, escolha **GitHub Actions** como fonte de publicação, se isso ainda não estiver selecionado.
4. Acompanhe a execução em **Actions**. Após o primeiro deploy, o GitHub mostrará o endereço do site em **Settings → Pages**.

Como o nome escolhido não é `Qluks.github.io`, o endereço padrão terá o formato `https://qluks.github.io/lucas-medeiros/`. Nenhum domínio personalizado foi informado.

O workspace local não está conectado a uma conta/repositório Git e o GitHub CLI não está instalado; por isso, o repositório ainda precisa ser criado na sua conta e os arquivos precisam ser enviados para iniciar o primeiro deploy.

## Projetos apresentados

- [Airflow Bacen Orchestration](https://github.com/Qluks/Airflow-Bacen-Orchestration): pipeline local com Airflow, camadas Bronze/Silver/Gold em Delta Lake e dashboard Streamlit.
- [Pipeline de Dados Abertos do Bacen](https://github.com/Qluks/Pipeline-de-Dados-Abertos-do-Bacen): ingestão do SGS, transformação com PySpark e Delta Lake, validação de qualidade, dashboard e automação com GitHub Actions.

Estrelas e data da última atualização são carregadas da API pública do GitHub. Se a API estiver indisponível ou atingir o limite de requisições, os links e descrições dos projetos continuam disponíveis e a página informa que não conseguiu carregar todos os indicadores.

O site também inclui animações leves de entrada e um fluxo visual animado, respeitando a preferência do sistema por movimento reduzido. O layout é responsivo e o menu móvel pode ser usado por teclado.
