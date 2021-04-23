<?php 

	class Home extends Controllers{
		public function __construct()
		{
			parent::__construct();
			session_start();
			if( isset($_SESSION['login']))
			{
				header('Location: '.base_url().'/dashboard');
				die();
			}
		}

		public function home()
		{
			
			$data['page_id'] = 1;
			$data['page_tag'] = "Login - ".NOMBRE_SISTEMA;
			$data['page_title'] = NOMBRE_SISTEMA;
			$data['page_name'] = "Inicio de sesion";
			$data['page_content'] = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, quis. Perspiciatis repellat perferendis accusamus, ea natus id omnis, ratione alias quo dolore tempore dicta cum aliquid corrupti enim deserunt voluptas.";
			$this->views->getView($this,"Usuarios/login",$data);

		
			
		}

	}
 ?>