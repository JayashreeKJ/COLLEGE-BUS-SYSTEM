package com.smartbus.dto;

import jakarta.validation.constraints.Size;

public class UpdateDriverRequest {

    @Size(max = 100, message = "Driver name must not exceed 100 characters")
    private String name;

    private String photoUrl;

    private Boolean removePhoto;

    public UpdateDriverRequest() {
    }

    public UpdateDriverRequest(String name, String photoUrl, Boolean removePhoto) {
        this.name = name;
        this.photoUrl = photoUrl;
        this.removePhoto = removePhoto;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Boolean getRemovePhoto() {
        return removePhoto;
    }

    public void setRemovePhoto(Boolean removePhoto) {
        this.removePhoto = removePhoto;
    }
}
