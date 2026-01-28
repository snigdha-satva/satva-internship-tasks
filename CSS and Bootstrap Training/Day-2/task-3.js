const form = document.getElementById("myForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const address = document.getElementById("address");
const gender = document.getElementById("gender");
const profilePic = document.getElementById("profilePic");
const terms = document.getElementById("terms");
const skillRadios = document.getElementsByName("skill");
const radioContainer = document.getElementById("radioContainer");

const mobileRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field){
    if(!field.value.trim()){
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        return false;
    }
    field.classList.add("is-valid");
    field.classList.remove("is-invalid");
    return true;
}

function validateEmail(){
    if(!email.value.trim() || !emailRegex.test(email.value)){
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        return false;
    }
    email.classList.add("is-valid");
    email.classList.remove("is-invalid");
    return true;
}

function validateMobile(){
    if(!mobile.value.trim() || !mobileRegex.test(mobile.value)){
        mobile.classList.add("is-invalid");
        mobile.classList.remove("is-valid");
        return false;
    }
    mobile.classList.add("is-valid");
    mobile.classList.remove("is-invalid");
    return true;
}

function validateProfile(){
    if(!profilePic.files || profilePic.files.length === 0){
        profilePic.classList.add("is-invalid");
        profilePic.classList.remove("is-valid");
        return false;
    }
    const file = profilePic.files[0];
    const allowedExt = ['png','jpg','jpeg','webp'];
    const ext = file.name.split('.').pop().toLowerCase();
    if(allowedExt.includes(ext)){
        profilePic.classList.add("is-valid");
        profilePic.classList.remove("is-invalid");
        return true;
    } else {
        profilePic.classList.add("is-invalid");
        profilePic.classList.remove("is-valid");
        profilePic.value = "";
        return false;
    }
}

function validateRadio(){
    let checked = false;
    for(let r of skillRadios){
        if(r.checked){
            checked = true;
            break;
        }
    }

    if(!checked){
        radioContainer.classList.add("border","border-danger","rounded","p-2");
        return false;
    }

    radioContainer.classList.remove("border","border-danger","rounded","p-2");
    return true;
}

function validateGender(){
    if(!gender.value){
        gender.classList.add("is-invalid");
        gender.classList.remove("is-valid");
        return false;
    }
    gender.classList.add("is-valid");
    gender.classList.remove("is-invalid");
    return true;
}

function validateTerms(){
    if(!terms.checked){
        terms.classList.add("is-invalid");
        return false;
    }
    terms.classList.remove("is-invalid");
    return true;
}

firstName.addEventListener("input", ()=>validateField(firstName));
lastName.addEventListener("input", ()=>validateField(lastName));
email.addEventListener("input", validateEmail);
mobile.addEventListener("input", validateMobile);
address.addEventListener("input", ()=>validateField(address));
gender.addEventListener("change", validateGender);
profilePic.addEventListener("change", validateProfile);
for(let r of skillRadios){
    r.addEventListener("change", validateRadio);
}

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const isFirstValid = validateField(firstName);
    const isLastValid = validateField(lastName);
    const isEmailValid = validateEmail();
    const isMobileValid = validateMobile();
    const isAddressValid = validateField(address);
    const isGenderValid = validateGender();
    const isProfileValid = validateProfile();
    const isRadioValid = validateRadio();
    const isTermsValid = validateTerms();

    if(isFirstValid && isLastValid && isEmailValid && isMobileValid && isAddressValid && isGenderValid && isProfileValid && isRadioValid && isTermsValid){
        alert("Form submitted successfully!");
        form.reset();
        resetValidation();
    }
    
});
