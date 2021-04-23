let Datos = ['#formRol', '#btnActionForm', '#btntext', '#formUsuario', '#btnActionForm', '#btnupdate'];
let Metodos = ['POST', 'GET'];
let URL = [base_url + '/Roles/setRol', ''];
let Modal = ['#modalFormRol'];

function openModal(){

    document.querySelector('#idRol').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML ="Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Rol";
    document.querySelector("#formRol").reset();
	$('#modalFormRol').modal('show');
}
//tabla contenido rol
var tableRoles;
document.addEventListener('DOMContentLoaded', function () {
    tableRoles = $('#tableRoles').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax": {
            "url": " " + base_url + "/Roles/getRoles",
            "dataSrc": ""
        },
        "columns": [
            { "data": "idrol" },
            { "data": "nombrerol" },
            { "data": "descripcion" },
            { "data": "status" },
            { "data": "options" }
        ],
        "resonsieve": "true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0, "desc"]]
    });
});
// tabla contenido rol fin

// formulario envio
$(document).ready(function () {
    $('#formRol').submit(function (e) {
        if ($('#txtNombre').val().length <= 6) {
            swal("Atención", "Varificar Campo Nombre", "error");
            return false;
        } else if ($('#txtDescripcion').val() == '') {
            swal("Atención", "Verificar Descripcion", "error");
            return false;
        } else if ($('#listStatus').val() == '') {
            swal("Atención", "Verificar Contraseña", "error");
            return false;
        } else {
                formulario(URL[0]);        
        }
        console.log('entro 2');
        return false;
    });
});
// fin formulario

function formulario(htpp) {
    // Capturamnos el boton de envío
    let btnEnviar = $(Datos[1]);
    let btntext = $(Datos[2]);
    btnEnviar.attr("disabled", "disabled");
    $.ajax({
        type: Metodos[0],
        url: htpp,
        data: $(Datos[0]).serialize(),
        beforeSend: function () {
            /*
            * Esta función se ejecuta durante el envió de la petición al
            * servidor.
            * */
            // btnEnviar.text("Enviando"); Para button 
            btntext.html("Enviando.."); // Para input de tipo button
            btnEnviar.attr("disabled", "disabled");
        },
        complete: function (data) {
            /*
            * Se ejecuta al termino de la petición
            * */
            btntext.html("INGRESAR");
            btnEnviar.removeAttr("disabled");
        },
        success: function (data) {
            var r = JSON.parse(data);
            if (r.status == true && r.r == 'in') {
                alertas(r.msg, 0);
                tableRoles.api().ajax.reload();
                $('#modalFormRol').modal("hide");
            } else if (r.status == true && r.r == 'up') {
                alertas(r.msg, 0);
                tableRoles.api().ajax.reload();
                $('#modalFormRol').modal("hide");
            } else {
                alertas(r.msg, 1);
            }
        },
        error: function (data) {
            /*
            * Se ejecuta si la peticón ha sido erronea
            * */
            console.log(data);
            alert("Problemas al tratar de enviar el formulario");
        }
    });
    // Nos permite cancelar el envio del formulario
    return false;
};

function fntEditRol(idrol){
    document.querySelector('#titleModal').innerHTML ="Actualizar Rol";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML ="Actualizar";

    var idrol = idrol;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl  = base_url+'/Roles/getRol/'+idrol;
    request.open("GET",ajaxUrl ,true);
    request.send();

    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            
            var objData = JSON.parse(request.responseText);
            if(objData.status)
            {
                document.querySelector("#idRol").value = objData.data.idrol;
                document.querySelector("#txtNombre").value = objData.data.nombrerol;
                document.querySelector("#txtDescripcion").value = objData.data.descripcion;

                if(objData.data.status == 1)
                {
                    var optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
                }else{
                    var optionSelect = '<option value="2" selected class="notBlock">Inactivo</option>';
                }
                var htmlSelect = `${optionSelect}
                                  <option value="1">Activo</option>
                                  <option value="2">Inactivo</option>
                                `;
                document.querySelector("#listStatus").innerHTML = htmlSelect;
                $('#modalFormRol').modal('show');
            }else{
                swal("Error", objData.msg , "error");
            }
        }
    }
}

function fntPermisos(idrol){
    var idrol = idrol;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Permisos/getPermisosRol/'+idrol;
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            document.querySelector('#contentAjax').innerHTML = request.responseText;
            $('.modalPermisos').modal('show');
            document.querySelector('#formPermisos').addEventListener('submit',fntSavePermisos,false);
        }
    }
}

function fntSavePermisos(evnet){
    evnet.preventDefault();
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Permisos/setPermisos'; 
    var formElement = document.querySelector("#formPermisos");
    var formData = new FormData(formElement);
    request.open("POST",ajaxUrl,true);
    request.send(formData);

    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            var objData = JSON.parse(request.responseText);
            if(objData.status)
            {
                swal("Permisos de usuario", objData.msg ,"success");
            }else{
                swal("Error", objData.msg , "error");
            }
        }
    }
    
}


function fntDelRol(idrol){
    var idrol = idrol;
    swal({
        title: "Eliminar Rol",
        text: "¿Realmente quiere eliminar el Rol?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancelar!",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        
        if (isConfirm) 
        {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/Roles/delRol/';
            var strData = "idrol="+idrol;
            request.open("POST",ajaxUrl,true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function(){
                if(request.readyState == 4 && request.status == 200){
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        swal("Eliminar!", objData.msg , "success");
                        tableRoles.api().ajax.reload(function(){
                            fntEditRol();
                            
                            fntPermisos();
                        });
                    }else{
                        swal("Atención!", objData.msg , "error");
                    }
                }
            }
        }

    });
}

