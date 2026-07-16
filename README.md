# Justech Convites Premium

Sistema reutilizável de convite digital, feito em HTML5 + CSS3 + JavaScript puro (sem frameworks), pronto para GitHub Pages.

## Novidades desta versão

- **Botões com cara de botão**: os hotspots de "Local da festa" e "Confirmar presença" agora têm brilho pulsante, reagem ao toque/hover e soltam uma ondulação dourada (ripple) ao clicar.
- **Convite com movimento**: leve respiração de zoom, parallax 3D que reage ao mouse (desktop) ou à inclinação do celular (giroscópio), e uma faixa de luz que atravessa a cena periodicamente.
- **Personagem animada**: um recorte da personagem (`assets/personagem.png`) fica sobreposto exatamente sobre a arte original e ganha um balanço contínuo sutil (respiração + leve oscilação), dando sensação de vida sem nunca se desalinhar.
- **Carta mais glamourosa**: carta maior (preenche muito mais a tela ao subir do envelope), com selo de cera animado, cantos ornamentais dourados e um brilho de folha de ouro percorrendo a moldura.

## Estrutura

```
index.html   → estrutura das duas telas (splash + convite)
style.css    → identidade visual, animações, responsividade
script.js    → painel CONFIG + toda a lógica (hotspots, personagem, parallax, música, transições)
assets/
  convite.jpg    → imagem única do convite (troque por evento)
  personagem.png → recorte recortado da personagem, com fundo transparente (para animação)
  music.mp3      → música ambiente (troque por evento)
```

## Como reaproveitar para um novo evento

Você só precisa mexer em **duas coisas**:

### 1. Trocar os arquivos de mídia
Substitua `assets/convite.jpg` e `assets/music.mp3` pelos novos arquivos, mantendo os mesmos nomes (ou ajuste os caminhos no passo 2).

### 2. Editar o painel CONFIG no topo de `script.js`

```js
const config = {
  backgroundImage: "assets/convite.jpg",
  music: "assets/music.mp3",
  mapsLink: "https://maps.google.com/?q=Local+da+Festa",
  whatsappNumber: "55DDDNUMERO",
  whatsappMessage: "Olá! Confirmo minha presença...",
  hotspots: {
    localizacao: { x: 8,  y: 78, width: 38, height: 12, action: "maps" },
    confirmacao: { x: 54, y: 78, width: 38, height: 12, action: "whatsapp" },
  },
};
```

- `x`, `y`, `width`, `height` são **porcentagens da imagem** (0–100), não pixels — assim funcionam em qualquer tela.
- Para descobrir as coordenadas certas de uma nova arte: abra a imagem em qualquer editor, veja a posição do botão/área desejada e converta para % (posição ÷ dimensão total × 100).
- Pode adicionar quantos hotspots quiser além de `localizacao` e `confirmacao` — o sistema lê todos automaticamente.

### 3. (Opcional) Trocar a personagem animada

Se a nova arte também tiver uma personagem/elemento central que valha a pena animar:

1. Recorte esse elemento em um editor (fundo transparente, PNG) e salve como `assets/personagem.png`.
2. Ajuste `characterLayer` em `script.js` com a posição em % do recorte dentro da imagem original (mesma lógica dos hotspots: `x`, `y`, `width`, `height`).

Se a nova arte não tiver personagem para animar, basta apagar a tag `<img id="character-layer">` do HTML (ou deixar como está — sem o arquivo `personagem.png`, o navegador só mostra um pequeno espaço vazio invisível, sem quebrar nada).

Nada mais no código precisa ser tocado para reaproveitar o convite em outro cliente/evento.

## Publicar no GitHub Pages

1. Suba estes arquivos para um repositório.
2. Em *Settings → Pages*, selecione a branch `main` e a pasta raiz.
3. O link gerado já funciona — a tela inicial aparece primeiro, e o convite só carrega após o clique em "Entrar no Convite".

## Notas técnicas

- A música só é iniciada após interação do usuário (clique), respeitando as políticas de autoplay dos navegadores.
- Os hotspots são recalculados automaticamente em resize/rotação de tela, sempre alinhados ao retângulo real da imagem (mesmo com letterboxing).
- Animações respeitam `prefers-reduced-motion`.
- Testado para funcionar em Android, iPhone, tablet e desktop.
