<?php 

	class Errors extends Controllers{
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

		public function notFound()
		{
			$this->views->getView($this,"error");
		}
	}

	$notFound = new Errors();
	$notFound->notFound();
 ?>