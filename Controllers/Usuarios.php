<?php 

	class Usuarios extends Controllers{
		public function __construct()
		{
			session_start();
			parent::__construct();
			if(isset($_SESSION['login']) || isset($_SESSION['userData']))
			{
				header('Location: '.base_url());
				die();
			}
			
		}


		public function Usuarios() 
		{
			$data['page_tag'] = "Usuarios";
			$data['page_title'] = "USUARIOS <small>Tienda Virtual</small>";
			$data['page_name'] = "usuarios";
			$data['page_functions_js'] = "functions_usuarios.js";
			$this->views->getView($this,"usuarios",$data);
			
		}

	public function login()
	{

		if ($_POST) {
			if (empty($_POST['mail']) || empty($_POST['pass'])) {
				$arrResponse = array("status" => false, "msg" => 'Problema al consultar, intente de nuevo');
			} else {
				$usuario = strClean($_POST['mail']);
				$pass = strClean($_POST['pass']);

				$arrData = $this->model->BuscarUsuario($usuario);
				if (empty($arrData)) {
					$arrResponse = array('status' => false, 'msg' => 'Datos no encontrados. ' . $usuario);
				} else {
					if (encrypt_decrypt(1, $pass) === $arrData['password']) {
						if($arrData['status']==0){
							
							$arrResponse = array('status' => false, 'msg' => "Usuario se encuentra  suspendido, favor de contactar al administrador del sistema");
						}else{
						$_SESSION['idUser']  = $arrData['idpersona'];
						$_SESSION['login'] = true;
						$arrDataL = $this->model->sessionLogin($_SESSION['idUser']);

						$a= $_SESSION['idUser'];
						sleep(1);
						$this->model->selectPermisosRol($_SESSION['userData']['idrol']);
						
						$arrResponse = array('status' => true, 'msg' => "Iniciando...");
					  }
					} else {
						$arrResponse = array('status' => false, 'msg' =>'Usuario o Contraseña incorrecta');
					}
				}
			}
		} else {
			$arrResponse = array("status" => false, "msg" => 'No es posible almacenar los datos.');
		}
		echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
		die();
	}

		public function validarduplicados(){
			if($_POST){
				$campo=$_POST['campo'];
				$id=$_POST['idUsuario'];
				$buscar = strClean($_POST['buscar']);
				if($campo=='txtIdentificacion'){
					$msj='NO. Identificacion se encuentra registrado';
				}elseif($campo=='txtTelefono'){
					$msj='Telefono se encuentra registrado';
				}elseif($campo=='txtEmail'){
					$msj='Correo, se encuentra registrado';
				}
				$arrData = $this->model->BuscarUsuario($buscar);
				if(empty($arrData)){
					$arrResponse = array("status" => true, "msg" => 'Datos Guarda Correctamente.');
				}else{
					if($id==$arrData['idpersona']){
						$arrResponse = array("status" => true, 'nombre' => $arrData['nombres'].' '.$arrData['apellidos'],"msg" => $msj);
					}else{
						$arrResponse = array("status" => false, 'nombre' => $arrData['nombres'].' '.$arrData['apellidos'],"msg" => $msj);
					}
					
				}
				echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
			}	
			die();
		}

	public function usuarionew()
	{

		if (empty($_POST['txtIdentificacion']) || empty($_POST['txtNombre']) || empty($_POST['txtApellido']) || empty($_POST['txtTelefono']) || empty($_POST['txtEmail']) || empty($_POST['listRolid']) || empty($_POST['listStatus'])) {
			$arrResponse = array("status" => false, "msg" => 'Datos incorrectos.');
		} else {
			$idUsuario = intval($_POST['idUsuario']);
			$strIdentificacion = strClean($_POST['txtIdentificacion']);
			$strNombre = ucwords(strClean($_POST['txtNombre']));
			$strApellido = ucwords(strClean($_POST['txtApellido']));
			$intTelefono = intval(strClean($_POST['txtTelefono']));
			$strEmail = strtolower(strClean($_POST['txtEmail']));
			$intTipoId = intval(strClean($_POST['listRolid']));
			$intStatus = intval(strClean($_POST['listStatus']));
			$strPassword = strClean($_POST['txtPassword']);

			$strPassword = encrypt_decrypt(1, $strPassword);
			if ($idUsuario == 0) {
				$option = 1;
				$request_user = $this->model->insertUsuario(
					$strIdentificacion,
					$strNombre,
					$strApellido,
					$intTelefono,
					$strEmail,
					$strPassword,
					$intTipoId,
					$intStatus
				);
			} else {
				$option = 2;
				$request_user = $this->model->updateUsuario(
					$idUsuario,
					$strIdentificacion,
					$strNombre,
					$strApellido,
					$intTelefono,
					$strEmail,
					$strPassword,
					$intTipoId,
					$intStatus
				);
			}

			if ($request_user > 0) {
				if ($option == 1) {
					$arrResponse = array("status" => true, "msg" => "Datos insertados");
				} else {
					$arrResponse = array("status" => true, "msg" => 'Datos actulizados.');
				}
			} else if ($request_user == 'exist') {
				$arrResponse = array('status' => false, 'msg' => '¡Atención! el email o la identificación ya existe, ingrese otro.');
			} else {
				$arrResponse = array("status" => false, "msg" => 'No es posible almacenar los datos.');
			}
		}
		echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
		die();
	}

	


		public function getUsuarios()
		{
			$arrData = $this->model->selectUsuarios();
			for ($i=0; $i < count($arrData); $i++) {

				if($arrData[$i]['status'] == 1)
				{
					$arrData[$i]['status'] = '<span class="badge badge-success">Activo</span>';
				}else{
					$arrData[$i]['status'] = '<span class="badge badge-danger">Inactivo</span>';
				}

				$arrData[$i]['options'] = '<div class="text-center">
				<button class="btn btn-info btn-sm btnViewUsuario" onClick="fntViewUsuario('.$arrData[$i]['idpersona'].')" title="Ver usuario"><i class="far fa-eye"></i></button>
				<button class="btn btn-primary  btn-sm btnEditUsuario" onClick="fntEditUsuario('.$arrData[$i]['idpersona'].')" title="Editar usuario"><i class="fas fa-pencil-alt"></i></button>
				<button class="btn btn-danger btn-sm btnDelUsuario" onClick="fntDelUsuario('.$arrData[$i]['idpersona'].')" title="Eliminar usuario"><i class="far fa-trash-alt"></i></button>
				</div>';
			}
			echo json_encode($arrData,JSON_UNESCAPED_UNICODE);
			die();
		}

		public function getUsuario(int $idpersona){
			
			$idusuario = intval($idpersona);
			if($idusuario > 0)
			{
				$arrData = $this->model->selectUsuario($idusuario);
				if(empty($arrData))
				{
					$arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
				}else{
					$arrResponse = array('status' => true, 'data' => $arrData);
				}
				echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
			}
			die();
		}

		public function delUsuario()
		{
			if($_POST){
				$intIdpersona = intval($_POST['idUsuario']);
				$requestDelete = $this->model->deleteUsuario($intIdpersona);
				if($requestDelete)
				{
					$arrResponse = array('status' => true, 'msg' => 'Se ha eliminado el usuario');
				}else{
					$arrResponse = array('status' => false, 'msg' => 'Error al eliminar el usuario.');
				}
				echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
			}
			die();
		}
	
		public function pp()
		{
			$idUsuario = intval('22');
					$strIdentificacion = strClean('228811866666');
					$strNombre = ucwords(strClean('marlon dddd'));
					$strApellido = ucwords(strClean('soyos monroy'));
					$intTelefono = intval(strClean('30931940'));
					$strEmail = strtolower(strClean('marlon.soyos@gmail.com'));
					$intTipoId = intval(strClean('6'));
					$intStatus = intval(strClean('1'));
					$strPassword = strClean('22881186marlons');

					$strPassword =encrypt_decrypt(1,$strPassword);
					
						
					echo	$request_user = $this->model->updateUsuario(
						$idUsuario,
						$strIdentificacion,
						$strNombre,
						$strApellido,
						$intTelefono,
						$strEmail,
						$strPassword,
						$intTipoId,
						$intStatus
					);
		}
		public function exitlogin(){
			session_destroy();
		}
	}
 ?>