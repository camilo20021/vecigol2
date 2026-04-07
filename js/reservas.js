const reservas = JSON.parse(localStorage.getItem('veciReservas')) || [];

function verificarDisponibilidad(cancha, fechaHora, duracion) {
    const [fecha, hora] = fechaHora.split('T');
    const [horaInicio, minInicio] = hora.split(':').map(Number);
    const horaFin = horaInicio + parseInt(duracion);
    
    return reservas.filter(r => {
        if (r.cancha !== cancha || r.fecha !== fecha) return false;
        
        const [hI, mI] = r.horaInicio.split(':').map(Number);
        const hF = hI + parseInt(r.duracion);
        
        return !(horaFin <= hI || horaInicio >= hF);
    });
}

function obtenerHorariosDisponibles(cancha, fecha, duracionRequerida) {
    const horariosDisponibles = [];
    const duracionNum = parseInt(duracionRequerida);
    
    for (let hora = 10; hora < 23 - duracionNum; hora++) {
        const horaStr = `${String(hora).padStart(2, '0')}:00`;
        const conflictos = reservas.filter(r => {
            if (r.cancha !== cancha || r.fecha !== fecha) return false;
            const [hI, mI] = r.horaInicio.split(':').map(Number);
            const hF = hI + parseInt(r.duracion);
            return !(hora + duracionNum <= hI || hora >= hF);
        });
        
        if (conflictos.length === 0) {
            horariosDisponibles.push(horaStr);
        }
    }
    
    return horariosDisponibles;
}

function mostrarNoDisponible(cancha, fecha, duracion) {
    const modal = document.getElementById('modalNoDisponible');
    const msgElement = document.getElementById('mensaje-nodisponible');
    const horariosDiv = document.getElementById('horarios-disponibles');
    
    const horariosDisponibles = obtenerHorariosDisponibles(cancha, fecha, duracion);
    const nombreCancha = cancha === 'cancha1' ? 'Cancha 1' : 'Cancha 2';
    
    msgElement.textContent = `Lo sentimos, ${nombreCancha} no está disponible en ese horario.`;
    
    if (horariosDisponibles.length > 0) {
        horariosDiv.innerHTML = horariosDisponibles.map(hora => `
            <button type="button" class="btn-horario" onclick="seleccionarHorario('${hora}')">
                ${hora}
            </button>
        `).join('');
    } else {
        horariosDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">No hay horarios disponibles este día</p>';
    }
    
    modal.style.display = 'flex';
}

function cerrarModalNoDisponible() {
    document.getElementById('modalNoDisponible').style.display = 'none';
}

function seleccionarHorario(hora) {
    document.getElementById('fecha').value = document.getElementById('fecha').value.split('T')[0] + 'T' + hora;
    cerrarModalNoDisponible();
}

function agendarDiferente() {
    document.getElementById('fecha').focus();
    cerrarModalNoDisponible();
}

function guardarReserva(nombre, email, telefono, cancha, jugadores, fechaHora, duracion, comentarios) {
    const [fecha, hora] = fechaHora.split('T');
    
    const nuevaReserva = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        cancha,
        jugadores,
        fecha,
        horaInicio: hora,
        duracion,
        comentarios,
        fechaCreacion: new Date().toISOString()
    };
    
    reservas.push(nuevaReserva);
    localStorage.setItem('veciReservas', JSON.stringify(reservas));
    
    return nuevaReserva;
}

document.getElementById("formularioReserva").addEventListener("submit", function(e){
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const cancha = document.getElementById("cancha").value;
    const jugadores = document.getElementById("jugadores").value;
    const fechaHora = document.getElementById("fecha").value;
    const duracion = document.getElementById("duracion").value;
    const comentarios = document.getElementById("comentarios").value;
    
    const conflictos = verificarDisponibilidad(cancha, fechaHora, duracion);
    
    if (conflictos.length > 0) {
        mostrarNoDisponible(cancha, fechaHora.split('T')[0], duracion);
        return;
    }
    
    const reserva = guardarReserva(nombre, email, telefono, cancha, jugadores, fechaHora, duracion, comentarios);
    
    alert(`✅ ¡Reserva confirmada!\n\nNombre: ${nombre}\nCancha: ${cancha}\nFecha: ${reserva.fecha}\nHora: ${reserva.horaInicio}\nDuración: ${duracion} hora(s)\n\n¡Nos vemos en VeciGol! ⚽🔥`);
    
    this.reset();
});
