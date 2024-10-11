import requests

def test_api(video_path):
    url = "http://127.0.0.1:8080/predictions/ensemble"  # 모델 이름을 'ensemble'으로 변경
    files = {'data': open(video_path, 'rb')}

    response = requests.post(url, files=files)
    print(response.json())


if __name__ == "__main__":
    video_path = "C:/Users/SSAFY/Desktop/project_AI/S11P21A302/AI/TorchServe/testfiles/C_3_12_11_BU_SYA_09-24_13-33-53_CB_RGB_DF2_M2.mp4"
    test_api(video_path)
