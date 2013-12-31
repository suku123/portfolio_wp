<?php
/* Template Name: About
*/
?>
<?php get_header( );?>
				
				<div class="container">
					<div class="row">
						<div class="span12 span7 contents">
							<img src="<?php bloginfo('template_directory');?>/img/suku1.jpg" width="670px" height="349px" alt="suku">
						</div>
						<div class="span12 span5 contents" id="aboutdesc">
							 <p><?php if ( have_posts() ) : while ( have_posts() ) : the_post();
								the_content();
								endwhile; endif; ?>
							</p>
						</div>
					</div>
				</div>
				
			</div>
<?php get_footer( );?>