#!/bin/bash

export CUDA_VISIBLE_DEVICES=3

nohup python result/scripts/train_gpu.py > output.log 2>&1 &
