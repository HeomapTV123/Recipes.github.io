const signUpModal = document.getElementById("signUpModal");
const openSignUpBtn = document.getElementById("openSignUpBtn");
const closeBtn = document.querySelectorAll(".close");
const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");

openLoginBtn.onclick = () => {
    loginModal.style.display = "flex";
};


openSignUpBtn.onclick = () => {
    signUpModal.style.display = "flex";
};

closeBtn.forEach(btn => {
    btn.onclick = () => {
        btn.closest(".modal").style.display = "none";
    }
})


window.onclick = (e) => {
    if (e.target === signUpModal) {
        signUpModal.style.display = "none";
    }
    else if(e.target === loginModal) {
        loginModal.style.display = "none";
    }
};

