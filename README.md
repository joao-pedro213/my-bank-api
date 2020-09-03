# my-bank-api

Está é uma API que fornece algumas rotas para simulçao de operações bancárias, como por exemplo: deposito, saque, transferências, checagem de saldo, etc. Ela foi desenvolvida durante o bootcamp de full stack developer oferecido pela IGTI, sendo que o principal objetivo desse desafio foi consolidar aprendizados de persistência de dados com o mongodb utilizando a biblioteca mongoose.

## Instalando as dependências

A biblioteca dotenv foi utilizada para apoiar algumas configurações do ambiente. Para ver quais são as variáveis utilizadas no ambiente basta verificar o arquivo .sample-env

```
npm install express mongoose
```

## Como usar

###### Routes

**account/deposit**: Rota para simular o deposito em uma conta corrente. Para isso, é necessário informar 3 atributos no body da requisição. São eles, respectivamente: agency, accountNumber e depositValue. Caso a conta em que deseja realizar o deposito não exista na base de dados é retornado uma mensagem com status 404.

**account/withdraw**: Rota para simular o saque em uma conta corrente. Para isso, é necessário informar 3 atributos no body da requisição. São eles, respectivamente: agency, accountNumber e withdrawValue. Caso a conta em que deseja realizar o saque não exista na base de dados é retornado uma mensagem com status 404. Além disso, caso o valor informado para o saque seja maior que o saldo disponível na conta é retornado um erro.

Observação: Para saques é descontado uma taxa de R$ 01,00. 
Exemplo: Caso deseje ser realizado um saque de R$ 1000,00 é preciso que o titular da conta tenha pelo menos R\$ 1001,00 de saldo.

**account/checkBalance**: Rota para verificar o saldo de uma determinada conta bancária. Para isso, é necessário informar no body da requisição os atributos agency e accountNumber. Caso a conta em que deseja verificar o saldo não exista na base de dados é retornado uma mensagem com status 404.

**account/newAccount**: Rota para realizar a criação de uma nova conta. Para isso é necessário informar os seguintes parâmetros no corpo da requisição: accountNumber, agency, e name.

**account/deleteAccount**: Rota para realizar a exclusão de uma conta existente. Caso a conta em que deseja verificar o saldo não exista na base de dados é retornado uma mensagem com status 404. Se a conta for excluída com sucesso é retornado um valor com o número total de contas cadastradas para a agência da conta deletada.

**account/transfer**: Rota para realizar a transferência de uma conta para outra. Para isso é necessário informar os seguintes parâmetros: originAccountAgency, originAccountNumber, destinationAccountAgency, destinationAccountNumber e transferValue.

As transferências ocorrem de acordo com a seguinte regra: caso a transferência ocorra entre contas de mesma agência então não são cobradas taxas. Caso seja uma transferência para outra agência é cobrado uma taxa de R\$ 08,00. Caso a conta de origem não tenha o saldo necessário para realizar a transferência é retornado uma mensagem com status 500. Outro situação que pode vir a acontecer é caso uma das duas contas informadas não estejam cadastradas na base de dados. Para este caso é retornado uma mensagem com status 404.

**account/balanceAvg**: Esta rota retorna a média dos saldos das contas correntes de uma determinada agência. Para isso, o parâmetro agency deve ser informado no corpo da requisição. Caso a agência informada não exista é retornado uma mensagem com status 404.

**account/clientsWithLowerBalance**: Esta rota retorna uma lista com os clientes que possuem o menor saldo na conta corrente em ordem crescente. Para está rota é necessário informar o parâmetro limit, que se refere ao tamanho da lista desejada.

**account/clientsWithHigherBalance**: Esta rota retorna uma lista com os clientes que possuem o maior saldo na conta corrente em ordem crescente. Para está rota é necessário informar o parâmetro limit, que se refere ao tamanho da lista desejado.

**account/privateClients**: Esta rota cria e retorna uma lista com os clientes que possuem maior saldo na conta de cada agência. Após isso esses clientes passam a fazer parte de uma agência especial de código 99.

Observação: Quando esta rota é chamada todos os clientes retornados na lista têm a sua agência atualizada na base de dados para o valor 99.
