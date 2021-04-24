let Datos = ['#formlogin', '#btnenviar','#btntext', '#formUsuario','#btnActionForm', '#btnupdate'];
let Metodos=['POST','GET'];
let URL=[base_url+'/Usuarios/login',''];
let Modal=['#modalFormUsuario'];
$(document).ready(function(){
    fntRolesUsuario();
  $(Datos[0]).submit(function(e){ 
      if($('#mail').val().length <=6){
        swal("Atención", "Varificar Campo Email" , "error");
        return false;
      }else if ($('#pass').val()==''){
        swal("Atención", "Verificar Contraseña" , "error");
        return false;
      }else{
          e.stopImmediatePropagation();
          formulario();      
      }
      return false; 
  });

  
});


function formulario(){
      // Capturamnos el boton de envío
      let btnEnviar = $(Datos[1]);
      let btntext = $(Datos[2]);
      btnEnviar.attr("disabled","disabled");
      $.ajax({
          type: Metodos[0],
          url: URL[0],
          data:$(Datos[0]).serialize(),
          beforeSend: function(){
              /*
              * Esta función se ejecuta durante el envió de la petición al
              * servidor.
              * */
              // btnEnviar.text("Enviando"); Para button 
              btntext.html("Enviando.."); // Para input de tipo button
              btnEnviar.attr("disabled","disabled");
          },
          complete:function(data){
              /*
              * Se ejecuta al termino de la petición
              * */
              btntext.html("INGRESAR");
              btnEnviar.removeAttr("disabled");
          },
          success: function(data){
              /*
              * Se ejecuta cuando termina la petición y esta ha sido
              * correcta
              * */
              var r = JSON.parse(data);
              console.log(r);
              if(r.status==true){
                location.reload();
              }else{
                alertas(r.msg, 1);
              }
          },
          error: function(data){
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


  function fntRolesUsuario(){
    if(document.querySelector('#listRolid')){
        let ajaxUrl = base_url+'/Roles/getSelectRoles';
        let request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        request.open("GET",ajaxUrl,true);
        request.send();
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200){
                document.querySelector('#listRolid').innerHTML = request.responseText;
                $('#listRolid').selectpicker('render');
            }
        }
    }
}

