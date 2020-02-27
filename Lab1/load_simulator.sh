# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

#install dependencies
pip3 install requests
pip3 install pyjwt
pip3 install jwt

#python3 order-simulator.py "https://xv6qbkv5ni.execute-api.us-east-1.amazonaws.com/Prod/order" 50 100
python3 client/order-simulator.py $1"/order" 3 5

#python3 product-simulator.py "https://xv6qbkv5ni.execute-api.us-east-1.amazonaws.com/Prod/product" 50 100
python3 client/product-simulator.py $1"/product" 3 5