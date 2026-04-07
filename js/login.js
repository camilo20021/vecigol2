const usuarios = {
    Wilmer: "1234",
    Nicolas: "0987",
    Camilo: "2468",
    Brayan: "1369"
};

document.addEventListener("DOMContentLoaded", () => {
    const formlogin = document.getElementById("formlogin");
    const mensaje = document.getElementById("mensaje");
    const btnIngreso = document.querySelector(".btn-ingreso");

    if (formlogin) {
        formlogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const user = document.getElementById("usuario").value.trim();
            const pass = document.getElementById("contrasena").value.trim();

            mensaje.className = "message";
            mensaje.textContent = "";

            if (!user || !pass) {
                mostrarMensaje("Por favor, completa todos los campos", "error");
                return;
            }

            btnIngreso.disabled = true;
            btnIngreso.innerHTML = '<span class="btn-text">Verificando...</span><span class="btn-icon">⏳</span>';

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (usuarios[user] === pass) {
                mostrarMensaje("¡Inicio de sesión exitoso! Redirigiendo...", "success");

                formlogin.style.transform = "scale(0.98)";
                setTimeout(() => {
                    sessionStorage.setItem("usuario", user);
                    window.location.href = "index.html";
                }, 1500);
            } else {
                mostrarMensaje("Usuario o contraseña incorrectos ❌", "error");
                btnIngreso.disabled = false;
                btnIngreso.innerHTML = '<span class="btn-text">Iniciar Sesión</span><span class="btn-icon">→</span>';

                formlogin.style.animation = "shake 0.5s ease-in-out";
                setTimeout(() => {
                    formlogin.style.animation = "";
                }, 500);
            }
        });
    }

    const usuarioLogueado = sessionStorage.getItem("usuario");
    const contenedorUser = document.getElementById("usuarioActivo");

    if (usuarioLogueado && contenedorUser) {
        contenedorUser.innerHTML = `
            <span>Hola, ${usuarioLogueado} 👋</span>
            <button onclick="cerrarSesion()" style="background:none; border:none; color:red; cursor:pointer; font-size:0.7rem; margin-left:5px;">(Salir)</button>
        `;
    }
});

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.className = `message ${tipo}`;

    if (tipo === "success") {
        setTimeout(() => {
            mensaje.className = "message";
            mensaje.textContent = "";
        }, 3000);
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    window.location.reload();
}

const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);