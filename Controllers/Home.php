<?php 

	class Home extends Controllers{
		public function __construct()
		{
			session_start();
			parent::__construct();
			
			if( isset($_SESSION['userData']))
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