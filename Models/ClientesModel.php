<?php 

	class ClientesModel extends Mysql
	{
		private $intIdUsuario;
		private $strIdentificacion;
		private $strNombre;
		private $strApellido;
		private $intTelefono;
		private $strEmail;
		private $strPassword;
		private $strToken;
		private $intTipoId;
		private $intStatus;

		public function __construct()
		{
			parent::__construct();
		}	

		public function BuscarUsuario(string $Usuario)
		{	

			$sql = "SELECT * FROM persona
			 WHERE email_user = '{$Usuario}' or identificacion = '{$Usuario}' or 
			 	   telefono='$Usuario}' or nit= '{$Usuario}' ";
			$request = $this->select($sql);
			return $request;
		}
		

	}

	
 ?>