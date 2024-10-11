package com.a302.wms.domain.camera.service;

import org.jetbrains.annotations.NotNull;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CameraSplitter {

    /**
     * FFmpeg를 사용하여 동영상을 분할합니다 (스트림 복사 방식).
     *
     * @param inputPath    원본 동영상 파일 경로
     * @param outputDir    분할된 동영상 파일을 저장할 디렉토리
     * @param segmentTime  각 분할의 길이 (초 단위)
     * @return 분할된 동영상 파일 경로 리스트
     * @throws Exception
     */
    public List<String> splitVideoStreamCopy(String inputPath, String outputDir, int segmentTime) throws Exception {
        List<String> outputFiles = new ArrayList<>();

        // 출력 디렉토리 생성
        File outDir = new File(outputDir);
        if (!outDir.exists()) {
            outDir.mkdirs();
        }

        // FFmpeg 명령어 구성
        Process process = getProcess(inputPath, outputDir, segmentTime);

        // FFmpeg 출력 읽기
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        // 프로세스 종료 대기
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("FFmpeg 분할 실패, 종료 코드: " + exitCode);
        }

        // 분할된 파일 리스트 수집
        File[] files = outDir.listFiles((dir, name) -> name.startsWith("output") && name.endsWith(".mp4"));
        if (files != null) {
            for (File file : files) {
                outputFiles.add(file.getAbsolutePath());
            }
        }

        return outputFiles;
    }

    private static @NotNull Process getProcess(String inputPath, String outputDir, int segmentTime) throws IOException {
        List<String> command = new ArrayList<>();
        command.add("ffmpeg");
        command.add("-i");
        command.add(inputPath);
        command.add("-c");
        command.add("copy");
        command.add("-map");
        command.add("0");
        command.add("-segment_time");
        command.add(String.valueOf(segmentTime));
        command.add("-force_key_frames");
        command.add("expr:gte(t,n_forced*60)");
        command.add("-f");
        command.add("segment");
        command.add("-reset_timestamps");
        command.add("1");
        command.add(outputDir + "/output%03d.mp4");

        ProcessBuilder builder = new ProcessBuilder(command);
        builder.redirectErrorStream(true);
        return builder.start();
    }

    public static void main(String[] args) {
        CameraSplitter splitter = new CameraSplitter();
        String inputVideo = "camera/test.mp4"; // 원본 동영상 경로
        String outputDirectory = "camera/split"; // 분할된 동영상 저장 경로
        int segmentLength = 10; // 각 분할의 길이 (초 단위)

        try {
            List<String> splitVideos = splitter.splitVideoStreamCopy(inputVideo, outputDirectory, segmentLength);
            System.out.println("분할된 동영상 파일:");
            splitVideos.forEach(System.out::println);
        } catch (Exception e) {

        }
    }
}
