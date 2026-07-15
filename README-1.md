# Justech Convites Premium

Sistema reutilizável de convite digital, feito em HTML5 + CSS3 + JavaScript puro (sem frameworks), pronto para GitHub Pages.

## Estrutura

```
index.html   → estrutura das duas telas (splash + convite)
style.css    → identidade visual, animações, responsividade
script.js    → painel CONFIG + toda a lógica (hotspots, música, transições)
assets/
  convite.jpg → imagem única do convite (troque por evento)
  music.mp3   → música ambiente (troque por evento)
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
