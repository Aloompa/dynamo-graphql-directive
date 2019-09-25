To run the examples:

```
aws dynamodb delete-table --table-name performers

aws dynamodb create-table \
 --table-name performers \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
 --endpoint-url http://localhost:8000

aws dynamodb create-table \
 --table-name events \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
 --endpoint-url http://localhost:8000

 aws dynamodb create-table \
 --table-name places \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
 --endpoint-url http://localhost:8000

aws dynamodb list-tables --endpoint-url http://localhost:8000
```

```
aws dynamodb put-item \
--table-name performers  \
--item \
    '{"id": {"S": "1"}, "name": {"S": "Johnny Cash"}}' \
--return-consumed-capacity TOTAL \
--endpoint-url http://localhost:8000

aws dynamodb put-item \
--table-name events  \
--item \
    '{"id": {"S": "1"}, "name": {"S": "Johnny Cash at the Ryman"}}' \
--return-consumed-capacity TOTAL \
--endpoint-url http://localhost:8000
```

TODO: write a migration script to do all this stuff.
