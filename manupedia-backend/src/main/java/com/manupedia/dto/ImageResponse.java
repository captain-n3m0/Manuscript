package com.manupedia.dto;

public class ImageResponse {
    private String imageType;
    private byte[] imageData;
    private Long manuscriptId;

    public ImageResponse() {}

    public ImageResponse(String imageType, byte[] imageData, Long manuscriptId) {
        this.imageType = imageType;
        this.imageData = imageData;
        this.manuscriptId = manuscriptId;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public Long getManuscriptId() {
        return manuscriptId;
    }

    public void setManuscriptId(Long manuscriptId) {
        this.manuscriptId = manuscriptId;
    }

    // Static builder method to replace @Builder functionality
    public static ImageResponseBuilder builder() {
        return new ImageResponseBuilder();
    }

    // Builder class
    public static class ImageResponseBuilder {
        private String imageType;
        private byte[] imageData;
        private Long manuscriptId;

        public ImageResponseBuilder imageType(String imageType) {
            this.imageType = imageType;
            return this;
        }

        public ImageResponseBuilder imageData(byte[] imageData) {
            this.imageData = imageData;
            return this;
        }

        public ImageResponseBuilder manuscriptId(Long manuscriptId) {
            this.manuscriptId = manuscriptId;
            return this;
        }

        public ImageResponse build() {
            return new ImageResponse(imageType, imageData, manuscriptId);
        }
    }
}