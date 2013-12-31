<?php 
/*
	Template Name: Blog
*/
?>
get_header(); ?>
<div class="span8">
			<?php if (have_posts() ) : while (have_posts() ) : the_post(); ?>
					<?php the_title( $before = '<h3>', $after = '</h3>', $echo = true ); ?>

				<?php the_content(); ?>
				<?php wp_get_archives("type=posbypost"); ?>

			<?php endwhile; ?>
			<!--post navigation -->
			<?php else: ?>
			<!-- no posts found -->
			<?php endif; ?>	
			
		</div>
		
<?php get_footer(); ?>