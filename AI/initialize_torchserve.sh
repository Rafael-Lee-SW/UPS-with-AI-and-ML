#!/bin/bash

export CUDA_VISIBLE_DEVICES=3

nohup torchserve \
    --start \
    --ncs \
    --model-store ../TorchServe/model_store \
    --models ensemble=../TorchServe/model_store/ensemble.mar \
    --ts-config ../TorchServe/config.properties \
    --disable-token-auth \
    > ../results/torchserve.log 2>&1 &
