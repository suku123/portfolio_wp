<?php get_header(); ?>
<div class="container">
	<div class="row">
		<div class="span8">
			<?php if (have_posts() ) : while (have_posts() ) : the_post(); ?>
					<?php the_title( $before = '<h3>', $after = '</h3>', $echo = true ); ?>

				<?php the_content(); ?>
				

			<?php endwhile; ?>
			<!--post navigation -->
			<?php else: ?>
			<!-- no posts found -->
			<?php endif; ?>	
			
		</div>
		<div class="span4">
			<img src="<?php bloginfo('template_url');?>/img/suku1.jpg" width="670px" height="349px" alt="suku">
		</div>
	</div>
</div>
<?php get_footer(); ?> 