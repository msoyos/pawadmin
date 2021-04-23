let Datos = ['#formUsuario', '#btnActionForm', '#btnText'];
let Metodos = ['POST', 'GET'];
let URL = [base_url + '/Usuarios/usuarionew', base_url + '/Usuarios/validarduplicados'];
let Modal = ['#modalFormRol'];


var tableUsuarios;
document.addEventListener('DOMContentLoaded', function(){

    tableUsuarios = $('#tableUsuarios').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/Usuarios/getUsuarios",
            "dataSrc":""
        },
        "columns":[
            {"data":"idpersona"},
            {"data":"nombres"},
            {"data":"apellidos"},
            {"data":"email_user"},
            {"data":"telefono"},
            {"data":"nombrerol"},
            {"data":"status"},
            {"data":"options"}
        ],
        'dom': 'lBfrtip',
        'buttons': [
            {
                "extend": "copyHtml5",
                "text": "<i class='far fa-copy'></i> Copiar",
                "titleAttr":"Copiar",
                "className": "btn btn-secondary"
            },{
                "extend": "excelHtml5",
                "text": "<i class='fas fa-file-excel'></i> Excel",
                "titleAttr":"Esportar a Excel",
                "className": "btn btn-success"
            },{
                "extend": "pdfHtml5",
                "text": "<i class='fas fa-file-pdf'></i> PDF",
                "titleAttr":"Esportar a PDF",
                "className": "btn btn-danger"
            },{
                "extend": "csvHtml5",
                "text": "<i class='fas fa-file-csv'></i> CSV",
                "titleAttr":"Esportar a CSV",
                "className": "btn btn-info"
            }
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 5,
        "order":[[0,"desc"]]  
    });
});
    // formulario envio
$(document).ready(function () {
    $('#txtEmail').val(0);
    $('#formUsuario').submit(function (e) {
        if ($('#txtIdentificacion').val().length <= 10) {
            swal("Atención", "Varificar Campo Identificacion", "error");
            return false;
        } else if ($('#txtNombre').val().length  <= 6) {
            swal("Atención", "Verificar Nombre", "error");
            return false;
        } else if (fntEmailValidate($('#txtEmail').val()) == false) {
            swal("Atención", "Verificar contrasena", "error");
            return false;
        } else if ($('#txtTelefono').val().length <= 7) {
            swal("Atención", "Verificar numero minimo 8 digitos", "error");
            return false;
        }else {
                formulario(URL[0]);        
        }
        
        return false;
    });
});

//verificar si exite identificacion,correo,numero

function buscarCampo(id, carateres) {
    
    let b = "#" + id;
    let a = $(b).val();
    if (a.length >= carateres) {
        
        var parametro = {
            "buscar": a,
            "campo":id,
            "idUsuario":$('#idUsuario').val()
        };
        formulario2(parametro);
    }
}

function formulario2(parametros) {
    // Capturamnos el boton de envío
    
    $.ajax({
        type: Metodos[0],
        url: URL[1],
        data: parametros,
        success: function (data) {
            var r = JSON.parse(data);
            if(r.status==false){
                swal("Atención",  r.msg+'( '+r.nombre+')', "error");
                $('#btnActionForm').attr("disabled", "disabled");
            }else{
                $('#btnActionForm').removeAttr("disabled"); 
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
function formulario(htpp) {
    // Capturamnos el boton de envío
    let btnEnviar = $(Datos[1]);
    let btntext = $(Datos[2]);
    btnEnviar.attr("disabled", "disabled");
    console.log(htpp);
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
            btntext.html("GUARDAR");
            btnEnviar.removeAttr("disabled");
        },
        success: function (data) {
            let r = JSON.parse(data);
           console.log(r);
           if(r.status==true){
                alertas(r.msg, 0);
                tableUsuarios.api().ajax.reload();
                $('#modalFormUsuario').modal("hide");
           }else{
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


// fin formulario
  


window.addEventListener('load', function() {
        fntRolesUsuario();
        /*fntViewUsuario();
        fntEditUsuario();
        fntDelUsuario();*/
}, false);



function fntRolesUsuario(){
    var ajaxUrl = base_url+'/Roles/getSelectRoles';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            document.querySelector('#listRolid').innerHTML = request.responseText;
            document.querySelector('#listRolid').value = 1;
            $('#listRolid').selectpicker('render');
        }
    }
    
}

function fntViewUsuario(idpersona){
    var idpersona = idpersona;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Usuarios/getUsuario/'+idpersona;
    request.open("GET",ajaxUrl,true);
    request.send();
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            var objData = JSON.parse(request.responseText);

            if(objData.status)
            {
               var estadoUsuario = objData.data.status == 1 ? 
                '<span class="badge badge-success">Activo</span>' : 
                '<span class="badge badge-danger">Inactivo</span>';

                document.querySelector("#celIdentificacion").innerHTML = objData.data.identificacion;
                document.querySelector("#celNombre").innerHTML = objData.data.nombres;
                document.querySelector("#celApellido").innerHTML = objData.data.apellidos;
                document.querySelector("#celTelefono").innerHTML = objData.data.telefono;
                document.querySelector("#celEmail").innerHTML = objData.data.email_user;
                document.querySelector("#celTipoUsuario").innerHTML = objData.data.nombrerol;
                document.querySelector("#celEstado").innerHTML = estadoUsuario;
                document.querySelector("#celFechaRegistro").innerHTML = objData.data.fechaRegistro; 
                $('#modalViewUser').modal('show');
            }else{
                swal("Error", objData.msg , "error");
            }
        }
    }
}

function fntEditUsuario(idpersona){
    document.querySelector('#titleModal').innerHTML ="Actualizar Usuario";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML ="Actualizar";

    var idpersona =idpersona;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Usuarios/getUsuario/'+idpersona;
    request.open("GET",ajaxUrl,true);
    request.send();
    request.onreadystatechange = function(){

        if(request.readyState == 4 && request.status == 200){
            var objData = JSON.parse(request.responseText);

            if(objData.status)
            {
                document.querySelector("#idUsuario").value = objData.data.idpersona;
                document.querySelector("#txtIdentificacion").value = objData.data.identificacion;
                document.querySelector("#txtNombre").value = objData.data.nombres;
                document.querySelector("#txtApellido").value = objData.data.apellidos;
                document.querySelector("#txtTelefono").value = objData.data.telefono;
                document.querySelector("#txtEmail").value = objData.data.email_user;
                document.querySelector("#listRolid").value =objData.data.idrol;
                $('#listRolid').selectpicker('render');

                if(objData.data.status == 1){
                    document.querySelector("#listStatus").value = 1;
                }else{
                    document.querySelector("#listStatus").value = 2;
                }
                $('#listStatus').selectpicker('render');
            }
        }
    
        $('#modalFormUsuario').modal('show');
    }
}

function fntDelUsuario(idpersona){
    document.querySelector('#txtEmail').value ="";
    var idUsuario = idpersona;
    swal({
        title: "Eliminar Usuario",
        text: "¿Realmente quiere eliminar el Usuario?",
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
            var ajaxUrl = base_url+'/Usuarios/delUsuario';
            var strData = "idUsuario="+idUsuario;
            request.open("POST",ajaxUrl,true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function(){
                if(request.readyState == 4 && request.status == 200){
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        swal("Eliminar!", objData.msg , "success");
                        tableUsuarios.api().ajax.reload();
                    }else{
                        swal("Atención!", objData.msg , "error");
                    }
                }
            }
        }

    });

}


function openModal()
{
    document.querySelector('#idUsuario').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML ="Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector("#formUsuario").reset();
    $('#modalFormUsuario').modal('show');
}