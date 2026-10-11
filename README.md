# Ateliê Nails Studio

Landing page em **Next.js, React, TypeScript e Tailwind CSS**, inspirada na composição visual das capturas de `studio-suelen-bezerra.vercel.app`. A identidade, os textos e as imagens deste projeto são próprios. As cinco fotografias foram geradas com IA e aparecem como referências conceituais, sem alegar que são trabalhos ou instalações reais do estúdio.

## Desenvolvimento

Requisitos: Node.js 22.18 ou superior e npm. A versão recomendada está em `.node-version`; o ambiente em nuvem foi preparado com Node.js 24.19 e npm 11.9. Os testes usam o suporte nativo a TypeScript dessa versão do Node.

```bash
cd /workspace/lp
npm ci --cache /workspace/.npm-cache
npm run dev
```

Em outra máquina, execute os mesmos comandos na raiz do checkout, omitindo a opção de cache ou escolhendo um diretório gravável. Use o checkout existente: as tarefas em nuvem já são isoladas, portanto não crie worktrees sem solicitação.

## Personalização

- **Nome, chamada e mensagem:** `src/lib/site-config.ts`.
- **Serviços:** `src/lib/services.ts`.
- **Textos, perguntas e diferenciais:** `src/app/page.tsx`.
- **Paleta, tipografia e espaçamentos:** `src/app/globals.css`.
- **Fotografias e prompts:** `public/images/` e `docs/image-prompts.md`.

Para preencher os contatos, copie `.env.example` para `.env.local` e inclua apenas os dados comerciais reais. O número do WhatsApp precisa estar no formato internacional, com DDI e DDD: somente os dígitos, sem o zero de operadora. Instagram e mapa devem usar URLs HTTPS completas. Os contatos são públicos, não são credenciais.

Sem número configurado, os botões abrem um aviso de agendamento em breve. Com o número preenchido, abrem `wa.me` com a mensagem pronta, incluindo o procedimento quando escolhido. Instagram, endereço, mapa e horário de funcionamento ficam ocultos enquanto vazios. Não há formulário que armazene dados pessoais nem backend de agenda.

As variáveis `NEXT_PUBLIC_*` são incorporadas pelo Next.js no build. Reinicie o desenvolvimento depois de editá-las; em produção, execute um novo build. O domínio canônico é opcional em `NEXT_PUBLIC_SITE_URL`.

`SITE_CONFIG.testimonials` começa vazio. Adicione somente depoimentos reais, com autorização; o layout está pronto para exibi-los. O estado inicial não apresenta avaliações, estatísticas ou depoimentos fictícios.

## Validação

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Os testes de navegador cobrem desktop, celular e telas estreitas: navegação por teclado, FAQ, aviso de contato, carrossel, ampliação de imagens, ausência de rolagem horizontal e carregamento das fotos. O Playwright inicia o servidor de produção automaticamente; o build precisa existir. No ambiente em nuvem ele usa `/usr/bin/chromium`. Em uma máquina sem Chromium instalado, execute `npx playwright install chromium`; também é possível informar o executável em `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Produção

```bash
npm ci
npm run build
npm run start
```

O deploy pode usar uma plataforma compatível com Next.js, como Vercel, ou um servidor Node.js. Configure os dados reais antes do build de publicação. As fontes são servidas localmente e as imagens são otimizadas por `next/image`, sem depender do site de referência.

O conteúdo inicial preserva o arquivo vazio do primeiro commit. Nenhuma publicação ou envio para o GitHub é realizado automaticamente.
