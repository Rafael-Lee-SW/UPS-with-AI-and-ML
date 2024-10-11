#!/bin/bash
# Script to create a model archive (.mar) file for the Ensemble model using torch-model-archiver

torch-model-archiver \
--model-name ensemble_model \
--version 1.0 \
--serialized-file result/models/x3d_best_model.pth \
--handler TorchServe/settings/ensemble_handler.py \
--extra-files "result/models/slowfast_best_model.pth,TorchServe/settings/index_to_name.json" \
--export-path TorchServe/model_store
