<?php 

	class Clientes extends Controllers{
		public function __construct()
		{
			session_start();
			parent::__construct();
			if($_SESSION['login']==false || !isset($_SESSION['login']))
			{
				header('Location: '.base_url());
				die();
			}
		}

		public function clientes()
		{
			$data['page_id'] = 2;
			$data['page_tag'] = "Clientes - Tienda Virtual";
			$data['page_title'] = "Clientes - Tienda Virtual";
			$data['page_name'] = "Clientes";
			$data['page_functions_js'] = "functions_dashboard.js";
			$this->views->getView($this,"ClientesView",$data);

			print_r($_SESSION);
		}

	}
 ?>