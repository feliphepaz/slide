# Slide

Slide desenvolvido durante o curso de JavaScript da Origamid. A intenção foi desenvolver ele como uma função construtora utilizando `class` e se beneficiando do seu método especial `constructor(args)`. onde os argumentos dela seriam sempre alterados de acordo com a aplicação do plugin em cada projeto. Ou seja, o objetivo foi desenvolver um slide que fosse sempre reutilizável. 

Ao ativar uma nova instância do `SlideNav`, devemos passar em seus 2 primeiros argumentos os seletores daquilo que seria o _slide-item_ (como por exemplo, a classe de uma tag `<li>` ou uma `<img>`) e o _slide_wrapper_ (o que segura os itens do slide, como uma `<ul>` ou `<div>`). O restante dos argumentos são opcionais dependendo do método que será ativado.
