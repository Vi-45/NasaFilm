package com.thdpv.movietheater.auth.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong dung dinh dang")
    private String email;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 6, message = "Mat khau phai co it nhat 6 ky tu")
    private String password;

    @NotBlank(message = "Ho va ten khong duoc de trong")
    private String fullName;

    @NotBlank(message = "So dien thoai khong duoc de trong")
    @Pattern(regexp = "^(0|\\+84)[35789][0-9]{8}$", message = "So dien thoai khong dung dinh dang")
    private String phoneNumber;

    @NotBlank(message = "Ngay sinh khong duoc de trong")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Ngay sinh khong dung dinh dang (yyyy-MM-dd)")
    private String dayOfBirth;

    @NotBlank(message = "Gioi tinh khong duoc de trong")
    @Pattern(regexp = "^(Nam|Nữ|Khác|Male|Female|Other)$", message = "Gioi tinh khong hop le")
    private String gender;

    public RegisterRequest(String email, String password, String fullName) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }

    public RegisterRequest(String email, String password, String fullName, String phoneNumber, String dayOfBirth, String gender) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.dayOfBirth = dayOfBirth;
        this.gender = gender;
    }

    public RegisterRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDayOfBirth() {
        return dayOfBirth;
    }

    public void setDayOfBirth(String dayOfBirth) {
        this.dayOfBirth = dayOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
