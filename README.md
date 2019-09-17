# serverless-nodejs-demo

#### Demo Serverless em Nodejs na arquitetura "Function as a Service (FaaS)" com AWS Lambda.

> O Serverless Framework consiste em uma CLI de código aberto que facilita o desenvolvimento, a implantação e o teste de aplicativos sem servidor em diferentes provedores de nuvem, além de um Painel hospedado que inclui recursos projetados para simplificar ainda mais o desenvolvimento, implantação e teste sem servidor, além de permitir que você para proteger e monitorar facilmente seus aplicativos sem servidor. [Serverless Framework](https://serverless.com/framework/docs/)

Este projeto está estruturado em 3 fluxos:

- API: Person Service
- Stream: Person Stream Notification
- Queue Consumer: Person Queue Consumer Notification

**Person Service** é um serviço rest composto por um CRUD básico e exposto pelo API Gateway, os dados são persistidos no DynamoDB(*NoSQL*) e dispara o stream.

**Person Stream Notification** é um ouvinte do stream da tabela *Person* do DynamoDB, ao capturar o evento ele posta na fila(SQS) **QUEUE_EMAIL_NOTIFICATION**

**Person Queue Consumer Notification** é um consumidor da fila **QUEUE_EMAIL_NOTIFICATION** ao receber a mensagem da queue  obtem o email que foi cadastrado e é disparado um email com uma mensagem de pincode. Exemplo: ```Olá Guilherme Milagre, Seu pincode é 608948```

Os 3 Serviços estão organizados em "Aplicativos" person-queue-consumer-notification, person-stream-notification, person-service.

**Forma utilizados os seguintes serviços:**
- API Gateway
- CloudFront
- AWS Lambda
- DynamoDB
- DynamoDB Stream
- SQS
- SES
