<?php /* Template Name: About
*/?>
<!DOCTYPE html>
	<html>
	<head>
			<meta charset="utf-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initia-scale=1.0">
			<title>Suku Nepali | Web developer</title>
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/bootstrap.min.css" type="text/css" media="screen">
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/bootstrap-responsive.min.css" type="text/css">
			<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/style.css" type="text/css">

	<!--[if !IE 7]>
	<style type="text/css">
		#wrap {display:table;height:100%}
	</style>
	<![endif]-->
	</head>
	<body>
		<div id="wrap">
			<div id="main" class="content">
				<div class ="container">
					<div class="row">
						<div class="span12" id="header">
							<a href="http://localhost/portfolio_project/index.html"><img src="<?php bloginfo('template_url');?>/img/header.gif" width="1200px" alt="Suku Nepali"></a>
						</div>
					</div>
				</div>
				<div class="container">
					<div class="row">
						<div class="span12">
							<div class="navbar">
								<div class="navbar-inner">
									
									<ul class="nav navbar-nav">
										<li><img src="<?php bloginfo('template_url');?>/img/leftnav.gif" alt="suku portfolio"></li>
										<li><a href="about.html">About</a></li>
										<li class="divider-vertical"></li>
										<li><a href="portfolio.html">Portfolio</a></li>
										<li class="divider-vertical"></li>
										<li><a href="http://www.skncharos.blogspot.com" target="_blank">Blog</a></li>
										<li class="divider-vertical"></li>
										<li><a href="contact.html">Contact</a></li>
									</ul>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<?php while ( have_posts() ) : the_post(); ?>

				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<header class="entry-header">
						<?php if ( has_post_thumbnail() && ! post_password_required() ) : ?>
						<div class="entry-thumbnail">
							<?php the_post_thumbnail(); ?>
						</div>
						<?php endif; ?>

						<h1 class="entry-title"><?php the_title(); ?></h1>
					</header><!-- .entry-header -->

					<div class="entry-content">
						<?php the_content(); ?>
						<?php wp_link_pages( array( 'before' => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentythirteen' ) . '</span>', 'after' => '</div>', 'link_before' => '<span>', 'link_after' => '</span>' ) ); ?>
					</div><!-- .entry-content -->

					<footer class="entry-meta">
						<?php edit_post_link( __( 'Edit', 'twentythirteen' ), '<span class="edit-link">', '</span>' ); ?>
					</footer><!-- .entry-meta -->
				</article><!-- #post -->

				<?php comments_template(); ?>
			<?php endwhile; ?>
				
			</div>
		</div>
		<div id="footer">
			<p>&copy 2013 Suku Nepali All Rights Reserved.</p>
		</div>	
	</body>
</html>