<!DOCTYPE html>
	<html>
	<head>
			<meta charset="utf-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title><?php bloginfo('name');?></title>
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/bootstrap.min.css" type="text/css" media="screen">
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/bootstrap-responsive.min.css" type="text/css">
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_url');?>" type="text/css">
			<link rel="shortcut icon" href="favicon.ico" />

			
		    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		    <link href='<?php bloginfo('stylesheet_directory');?>/css/responsive-slider.css' id='responsive-slider-css' media='all' rel='stylesheet' type='text/css'>
		    <link href='<?php bloginfo('stylesheet_directory');?>/css/styles.css' id='contact-form-7-css' media='all' rel='stylesheet' type='text/css'>
		    <script src='<?php bloginfo('template_url');?>/js/jquery.js' type='text/javascript'></script>

			<script id='similar_sf_js' src='<?php bloginfo('template_url');?>/js/countryscript' type='text/javascript'></script>
		    <script src='<?php bloginfo('template_url');?>/js/sf_preloader.jsp' type='text/javascript'></script>
		    <script src='<?php bloginfo('template_url');?>/js/sf_code.jsp' type='text/javascript'></script>
		    <script src='<?php bloginfo('template_url');?>/js/base_single_icon.js' type='text/javascript'></script>
		    <script src='<?php bloginfo('template_url');?>/js/dojo.js' type='text/javascript'></script>
		    <script charset='utf-8' src='<?php bloginfo('template_url');?>/js/script.js' type='text/javascript'></script>
		    <script charset='utf-8' src='<?php bloginfo('template_url');?>/js/window.js' type='text/javascript'></script>
		    <script charset='utf-8' id='sufioIoScript1' src='<?php bloginfo('template_url');?>/js/getSupportedSitesJSON.action' type='text/javascript'></script>
		    <script src='<?php bloginfo('template_url');?>/js/preload.js' type='text/javascript'></script>

			<?php if(is_singular()) {wp_enqueue_script('comment-reply');}?>
			<?php wp_head();?>
			</head>
			<body>
				<div id="wrap">
					<div class ="container">
						<div class="row">
							<div class="span12" id="header">
								<a href="<?php echo home_url();?>"><img src="<?php bloginfo('template_url');?>/img/header.gif" width="1200px" alt="Suku Nepali"></a>
							</div>
						</div>
					</div>
					<div class="container">
						<div class="row">
							<div class="navbar span12">
								<div class="navbar-inner span8" id="navmenu">
									<ul class="main-nav">
										<?php wp_list_pages('title_li='); ?>
										
									</ul> 
								</div>
								<?php get_search_form(); ?>
							</div>	
			
						</div>
					</div>