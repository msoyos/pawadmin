<?php 

	class Dashboard extends Controllers{
		public function __construct()
		{
			session_start();
			parent::__construct();
			
			if( !isset($_SESSION['userData']))
			{
				header('Location: '.base_url());
				die();
			}
			
		}

		public function dashboard()
		{
			$data['page_id'] = 2;
			$data['page_tag'] = "Dashboard - Tienda Virtual";
			$data['page_title'] = "Dashboard - Tienda Virtual";
			$data['page_name'] = "dashboard";
			$data['page_functions_js'] = "functions_dashboard.js";
			$this->views->getView($this,"dashboard",$data);

			print_r($_SESSION);
		}

	}
 ?>