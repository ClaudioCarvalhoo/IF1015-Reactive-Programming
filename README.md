# Atividade com Programação Reativa RxJS

## Qual o principal ponto para se tratar os sources com RxJS?

Creio que seja a questão de pegar todas as mensagens que chegam e mandá-las para um (ou mais) observers, que por sua vez podem fazer parte de subjects. Em situações onde queremos tratar as informações da mesma maneira, como a que ocorreu nos exercícios, creio que seja também legal fazer as operações (como merge e filter) nos próprios observers/subjects ao invés de fazer por fora, o que complicaria o código e não faria proveito de nosso modelo de programação reativa.

## Quais as principais dificuldades com a resolução do exercício?

Para mim foi aprender a programação reativa em um nível suficiente para conseguir implementar alguma coisa, dado que alguns conceitos são bem diferentes e novos. Também foi desafiador tratar com tantos modelos de comunicação de uma só vez, tendo vários terminais abertos rodando programas diferentes. Para mim ainda ocorreu um problema no qual caso a aplicação seja aberta antes do source web socket, ela não tenta mais reconectar e consequentemente não consegue receber as mensagens dele e também as mensagens do source gRPC por causa do merge que eles têm no meio do caminho. Demorei bastante até detectar que esse era o problema, pois achava que era uma falha na minha implementação do subject gRPC.
