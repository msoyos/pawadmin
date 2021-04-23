<?php 
	
	//define("BASE_URL", "http://localhost/tienda_virtual/");
	
	const BASE_URL = "http://localhost/pawadmin";
	//definimos nombre del sistema
	const NOMBRE_SISTEMA='PAWSOYOS';
	
	//Zona horaria
	date_default_timezone_set('America/Guatemala');

	//Datos de conexión a Base de Datos
	const DB_HOST = "localhost";
	const DB_NAME = "db_tiendavirtual";
	const DB_USER = "root";
	const DB_PASSWORD = "";
	const DB_CHARSET = "utf8";

	//Deliminadores decimal y millar Ej. 24,1989.00
	const SPD = ".";
	const SPM = ",";

	//Simbolo de moneda
	const SMONEY = "Q";

	//Datos para Encriptar / Desencriptar
	const KEY = '190420201DIOSESFIEL';
	const KEY2IV = '14222019D10';
	const METHODENCRIPT = "AES-256-CBC";


 ?>