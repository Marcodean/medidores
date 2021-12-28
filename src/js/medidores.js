import '../css/componente.css';

const btnCalcularMedidores = document.querySelector('.formulario__btn');
const formulario = document.getElementById('formulario');
const listMedidor = document.querySelector('.listMedidor');
const listRes = document.querySelector('.resultados');
const btnNumMedidores = document.querySelector('.btn__medidor');
let inputValues = document.querySelector(".domTextElement");
var inputValue;
var N;
export const crearMedidor = (numMed) => {

    let div, newMedidor;


    const boxMedidor = document.querySelectorAll('.dinMedi');

    boxMedidor.forEach(elem => {
        const box = document.getElementById('box');
        box.removeChild(elem)
    })
 
    for (let i = 1; i <= numMed; i++) {
        newMedidor = `
        <div class="col-md boxMedidor dinMedi">
        <div>Medidor ${i}</div>
        
        <div class="form-group row formulario__grupo" id="grupo__fechaActual${i}">
            <label for="fechaActual${i}" class="col-lg-3 col-form-label formulario__label">Cantidad KWh Fecha Actual:</label>
            <div class="col-lg-4 mt-4 formulario__grupo-input">
                <input type="text" class="form-control formulario__input all_input" id="fechaActual${i}" name="fechaActual${i}">
                <i class="formulario__validacion-estado fas fa-times-circle"></i>
            </div>
            <p class="formulario__input-error">Coloque bien el numero.</p>
        </div>
     
        <div class="form-group row formulario__grupo" id="grupo__fechaAnterior${i}">
            <label for="fechaAnterior${i}" class="col-lg-3 col-form-label formulario__label">Cantidad KWh Fecha Anterior:</label>
            <div class="col-lg-4 mt-4 formulario__grupo-input">
                <input type="text" class="form-control formulario__input all_input" id="fechaAnterior${i}" name="fechaAnterior${i}">
                <i class="formulario__validacion-estado fas fa-times-circle"></i>
            </div>
            <p class="formulario__input-error">Coloque bien el numero.</p>
        </div>
        <br>
        </div>`;
        div = document.createElement('div');
        div.innerHTML = newMedidor;
        listMedidor.append(div.firstElementChild);
    }


}

const devolverNumMed = () => {

    inputValue = inputValues.value;


    crearMedidor(inputValue);
    N = parseInt(inputValue) + 1


}

btnNumMedidores.addEventListener('click', devolverNumMed);





/* const N=numMed+1 */
//const N=4; // include hasta el medidor principal
const getData = (fac, fan, costoFijo) => {
    /* const CF = 7.4; */
    console.log(fac, fan, costoFijo);
    let CF=costoFijo[1]+costoFijo[2]+costoFijo[3];
    let CFD = CF / (N - 1);
    let Pu = costoFijo[0];
    let Er = costoFijo[4];
    console.log("Valores fijos :",CF, CFD,Pu,Er);
    let x = [], xx = [], y = [], con = [], xconIGV = [], xxIGV , allxx=[];
    for (let i = 0; i < N; i++) {

        if (fac[i] >= fan[i]) {
            x[i] = fac[i] - fan[i];
        } else {
            x[i] = fan[i] - fac[i];
        }
        console.log(x)
        xx[i] = x[i] * Pu;
        console.log(xx[0], "all con precio unitario: ",xx[1], xx)
    }
    for (let i = 0; i < N; i++) {
        y[i] = x[i] * Er;
    }
    console.log("ER: ", y[0],y);

    for(let i=0; i<N-1;i++){
        allxx[i] = xx[i+1];
    }
    console.log("allxx",allxx)
   /*  for (let i = 1; i < N; i++) {
        console.log('Entrada del XX CFD',xx ,CFD)
        con[i - 1] = xx[i] + CFD;
        console.log('Resto de medidore CON IN',con)
    } */
    for (let i = 0; i < N-1; i++) {
        console.log('Entrando  allxx y CFD',allxx ,CFD)
        allxx[i] = allxx[i] + CFD;
        console.log('Resto de medidore CON IN',allxx)
    }
    console.log('Resto de medidore CON OUT',con)
    xx[0] = xx[0] + CF;
    console.log('medidor principal sumado CF',xx[0])
    xxIGV = xx[0] * 0.18;
    console.log('medidor principal con 18%',xxIGV)
    xx[0] = xx[0] + xxIGV;
    console.log('medidor principal sumado IGV',xx[0])
    /* xx[0] = xx[0] + y[0]; */
    console.log('multiplicado por electri rural',y[0])
    console.log('medidor principal',xx[0])
    let allxx2 = [...allxx];
    let allxx3=[...allxx];
    let allxx4=[];
   
    for (let i = 0; i < N - 1; i++) {
        xconIGV[i] = allxx2[i] * 0.18;
        console.log('Resto de meidores con 18%',xconIGV)
        allxx4[i] = allxx3[i] + xconIGV[i];
        console.log('Resto de medidores sumado IGV',allxx4);
      /*   allxx6[i] = allxx5[i] + y[i + 1];
        console.log('medidores ',allxx6) */
    }
    let allxx5=[...allxx4];
    for (let i = 0; i < N - 1; i++) {
        allxx5[i] = allxx5[i] + y[i + 1];
        console.log('medidores ',allxx5)
    }
    console.log(xx,allxx5);
    mostrarDatos(xx, allxx4);
}

formulario.addEventListener('submit', (e) => {

    e.preventDefault();
    const formData = new FormData(e.target);
    const data = [...formData];
    const allData = [], k = 1;
    let dataMedidores = [], dataCostesFijos = [], dataFac = [], dataFan = [], par = 0, impar = 0;
    // extrayendo los valores de todo los inputs
    for (let i = 0; i < (2 * N) + 5; i++) {
        allData[i] = data[i][k];
    }

    // dividiendo los datos de los medidores
    dataMedidores = allData.slice(0, 2 * N);

    // dividiendo los datos de los costes fijos
    dataCostesFijos = allData.slice((2 * N), (2 * N) + 5);

    // seperando el array de puras fechas actuales vs fechas anteriores
    for (let i = 0; i < dataMedidores.length; i++) {
        if (i % 2 == 0) {
            dataFac[par] = dataMedidores[i];
            par++;
        } else {
            dataFan[impar] = dataMedidores[i];
            impar++;
        }
    }

    // conviertiendo el tipo de dato de string a number
    const fac = dataFac.map(Number);
    const fan = dataFan.map(Number);
    const costoFijo = dataCostesFijos.map(Number);
    /* const fac = [13104, 1955.6, 3431.3, 1399.7, 899.9, 1586.9, 1291.3]
    const fan = [12828, 1918.8, 3359.9, 1389.8, 851.3, 1569.9, 1223.3] 
    const costoFijo = [0.753, 15.17, 3.8, 1.29, 2.43] */

    getData(fac, fan, costoFijo);
    const valorCostoFijos = campos.precioUni && campos.alumPub && campos.cargFij && campos.mantRepos && campos.electRur;
    let numMed = N - 1;
    switch (numMed) {
        case 1:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaAnterior && campos.fechaAnterior1 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });

                btnCalcularMedidores.toggleAttribute('disabled', true); //como el form no se envia se debe de volver a bloquear el boton


                Object.keys(errs).forEach(key => { errs[key] = true }); // reset del obj errs para que se bloque el boton una vez despues enviado el form
            }
            break;
        case 2:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 3:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 4:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 5:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 6:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 7:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaActual7 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && campos.fechaAnterior7 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 8:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaActual7 && campos.fechaActual8 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && campos.fechaAnterior7 && campos.fechaAnterior8 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 9:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaActual7 && campos.fechaActual8 && campos.fechaActual9 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && campos.fechaAnterior7 && campos.fechaAnterior8 && campos.fechaAnterior9 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 10:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaActual7 && campos.fechaActual8 && campos.fechaActual9 && campos.fechaActual10 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && campos.fechaAnterior7 && campos.fechaAnterior8 && campos.fechaAnterior9 && campos.fechaAnterior10 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
        case 11:
            if (campos.fechaActual && campos.fechaActual1 && campos.fechaActual2 && campos.fechaActual3 && campos.fechaActual4 && campos.fechaActual5 && campos.fechaActual6 && campos.fechaActual7 && campos.fechaActual8 && campos.fechaActual9 && campos.fechaActual10 && campos.fechaActual11 && campos.fechaAnterior && campos.fechaAnterior1 && campos.fechaAnterior2 && campos.fechaAnterior3 && campos.fechaAnterior4 && campos.fechaAnterior5 && campos.fechaAnterior6 && campos.fechaAnterior7 && campos.fechaAnterior8 && campos.fechaAnterior9 && campos.fechaAnterior10 && campos.fechaAnterior11 && valorCostoFijos) {
                formulario.reset();
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-correcto');
                });
                document.querySelectorAll('.formulario__grupo-incorrecto').forEach((icono) => {
                    icono.classList.remove('formulario__grupo-incorrecto');
                });
                btnCalcularMedidores.toggleAttribute('disabled', true);
                Object.keys(errs).forEach(key => { errs[key] = true });
            }
            break;
    }

});



const expresiones = {
    numero: /^\d+(\.\d+)?$/
}

const campos = {
    fechaActual: false,
    fechaAnterior: false,
    fechaActual1: false,
    fechaAnterior1: false,
    fechaActual2: false,
    fechaAnterior2: false,
    fechaActual3: false,
    fechaAnterior3: false,
    fechaActual4: false,
    fechaAnterior4: false,
    fechaActual5: false,
    fechaAnterior5: false,
    fechaActual6: false,
    fechaAnterior6: false,
    fechaActual7: false,
    fechaAnterior7: false,
    fechaActual8: false,
    fechaAnterior8: false,
    fechaActual9: false,
    fechaAnterior9: false,
    fechaActual10: false,
    fechaAnterior10: false,
    fechaActual11: false,
    fechaAnterior11: false,

    precioUni: false,
    alumPub: false,
    cargFij: false,
    mantRepos: false,
    electRur: false
}

//  inicializar valores para controlar el boton desabilitando
const errs = {
    fechaActual: true,
    fechaAnterior: true,
    fechaActual1: true,
    fechaAnterior1: true,
    fechaActual2: true,
    fechaAnterior2: true,
    fechaActual3: true,
    fechaAnterior3: true,
    fechaActual4: true,
    fechaAnterior4: true,
    fechaActual5: true,
    fechaAnterior5: true,
    fechaActual6: true,
    fechaAnterior6: true,
    fechaActual7: true,
    fechaAnterior7: true,
    fechaActual8: true,
    fechaAnterior8: true,
    fechaActual9: true,
    fechaAnterior9: true,
    fechaActual10: true,
    fechaAnterior10: true,
    fechaActual11: true,
    fechaAnterior11: true,

    precioUni: true,
    alumPub: true,
    cargFij: true,
    mantRepos: true,
    electRur: true
}

const validarFormulario = (e) => {
    if (e.target.classList.contains('all_input')) {

        switch (e.target.name) {
            case "fechaActual":
                validarCampo(expresiones.numero, e.target, 'fechaActual');
                break;
            case "fechaAnterior":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior');
                break;
            case "fechaActual1":
                validarCampo(expresiones.numero, e.target, 'fechaActual1');
                break;
            case "fechaAnterior1":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior1');
                break;
            case "fechaActual2":
                validarCampo(expresiones.numero, e.target, 'fechaActual2');
                break;
            case "fechaAnterior2":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior2');
                break;
            case "fechaActual3":
                validarCampo(expresiones.numero, e.target, 'fechaActual3');
                break;
            case "fechaAnterior3":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior3');
                break;
            case "fechaActual4":
                validarCampo(expresiones.numero, e.target, 'fechaActual4');
                break;
            case "fechaAnterior4":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior4');
                break;
            case "fechaActual5":
                validarCampo(expresiones.numero, e.target, 'fechaActual5');
                break;
            case "fechaAnterior5":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior5');
                break;
            case "fechaActual6":
                validarCampo(expresiones.numero, e.target, 'fechaActual6');
                break;
            case "fechaAnterior6":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior6');
                break;
            case "fechaActual7":
                validarCampo(expresiones.numero, e.target, 'fechaActual7');
                break;
            case "fechaAnterior7":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior7');
                break;
            case "fechaActual8":
                validarCampo(expresiones.numero, e.target, 'fechaActual8');
                break;
            case "fechaAnterior8":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior8');
                break;
            case "fechaActual9":
                validarCampo(expresiones.numero, e.target, 'fechaActual9');
                break;
            case "fechaAnterior9":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior9');
                break;
            case "fechaActual10":
                validarCampo(expresiones.numero, e.target, 'fechaActual10');
                break;
            case "fechaAnterior10":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior10');
                break;
            case "fechaActual11":
                validarCampo(expresiones.numero, e.target, 'fechaActual11');
                break;
            case "fechaAnterior11":
                validarCampo(expresiones.numero, e.target, 'fechaAnterior11');
                break;



            case "precioUni":
                validarCampo(expresiones.numero, e.target, 'precioUni');
                break;
            case "alumPub":
                validarCampo(expresiones.numero, e.target, 'alumPub');
                break;
            case "cargFij":
                validarCampo(expresiones.numero, e.target, 'cargFij');
                break;
            case "mantRepos":
                validarCampo(expresiones.numero, e.target, 'mantRepos');
                break;
            case "electRur":
                validarCampo(expresiones.numero, e.target, 'electRur');
        }
        submitControler();
    }

}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;  // para que si todos los campos estan llenos los reseteara y borran lo icons
        errs[input.name] = false; // si es false se habilitara el boton
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
        errs[input.name] = true; // si es true se desabilitara el boton
    }
}

const submitControler = () => {
    const valorCostoFijo = errs.precioUni || errs.alumPub || errs.cargFij || errs.mantRepos || errs.electRur;
    let numMed = N - 1;
    switch (numMed) {
        case 1:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaAnterior || errs.fechaAnterior1 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 2:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 3:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 4:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 5:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 6:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 7:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaActual7 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || errs.fechaAnterior7 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 8:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaActual7 || errs.fechaActual8 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || errs.fechaAnterior7 || errs.fechaAnterior8 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 9:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaActual7 || errs.fechaActual8 || errs.fechaActual9 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || errs.fechaAnterior7 || errs.fechaAnterior8 || errs.fechaAnterior9 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 10:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaActual7 || errs.fechaActual8 || errs.fechaActual9 || errs.fechaActual10 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || errs.fechaAnterior7 || errs.fechaAnterior8 || errs.fechaAnterior9 || errs.fechaAnterior10 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;
        case 11:
            if (errs.fechaActual || errs.fechaActual1 || errs.fechaActual2 || errs.fechaActual3 || errs.fechaActual4 || errs.fechaActual5 || errs.fechaActual6 || errs.fechaActual7 || errs.fechaActual8 || errs.fechaActual9 || errs.fechaActual10 || errs.fechaActual11 || errs.fechaAnterior || errs.fechaAnterior1 || errs.fechaAnterior2 || errs.fechaAnterior3 || errs.fechaAnterior4 || errs.fechaAnterior5 || errs.fechaAnterior6 || errs.fechaAnterior7 || errs.fechaAnterior8 || errs.fechaAnterior9 || errs.fechaAnterior10 || errs.fechaAnterior11 || valorCostoFijo) {
                btnCalcularMedidores.toggleAttribute('disabled', true);
            } else {
                btnCalcularMedidores.toggleAttribute('disabled', false);
            }
            break;

        default: console.log("te pasastes el numero de medidores")

    }



}

document.addEventListener('keyup', validarFormulario);

const mostrarDatos = (xx, con) => {
    const consMedidorPrincipal = [];
    let conRestoMedidores = [];
    let div, newRes;


    const resDatos = document.querySelectorAll('.resDatos');

    resDatos.forEach(elem => {
        const box = document.querySelector('.resultados');
        box.removeChild(elem)
    })



    consMedidorPrincipal[0] = xx[0];
    conRestoMedidores = con.slice();
    const allMedidores = [...consMedidorPrincipal, ...conRestoMedidores];

    for (let i = 0; i < N; i++) {
        newRes = `
    <div class="row mt-5 resDatos">
    <div class="col-md">
        <div  class="medidas__independientes">Medidor ${(i == 0) ? 'Principal' : i} : </div>
        <div  class="medidas__independientes resultados__medidas res_bold">
        ${allMedidores[i]}
        </div>
    </div>
   </div>`;
        div = document.createElement('div');
        div.innerHTML = newRes;
        listRes.append(div.firstElementChild);
    }

}


