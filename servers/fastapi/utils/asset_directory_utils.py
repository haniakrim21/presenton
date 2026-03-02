import os
from utils.get_env import get_app_data_directory_env


def get_images_directory():
    images_directory = os.path.join(get_app_data_directory_env(), "images")
    os.makedirs(images_directory, exist_ok=True)
    return images_directory


def get_exports_directory():
    export_directory = os.path.join(get_app_data_directory_env(), "exports")
    os.makedirs(export_directory, exist_ok=True)
    return export_directory

def get_uploads_directory():
    uploads_directory = os.path.join(get_app_data_directory_env(), "uploads")
    os.makedirs(uploads_directory, exist_ok=True)
    return uploads_directory


def get_knowledge_base_directory():
    kb_directory = os.path.join(get_app_data_directory_env(), "knowledge_base")
    os.makedirs(kb_directory, exist_ok=True)
    return kb_directory
