<?php 
/*
	Template Name: Blog
*/
?>
<?php get_header(); ?>
<div class="container">
	<div class="row">
		<div class="span12 span8 blogpage">
			<?php if (have_posts() ) : while (have_posts() ) : the_post(); ?>
				<div class="post-content">
					<h2><a href="<?php the_permalink(); ?>" title="Permanent link to <?php the_title_attribute( );?>"><?php the_title(); ?></a></h2>
				
					<strong><?php the_time('F jS, Y') ?> by <?php the_author_posts_link() ?></strong>
					<br>
					<?php the_content('Read More...');?>
					<p class="postmetadata">Posted in <?php the_category(', '); ?></p>
				</div>
			<?php endwhile; ?>
			<!--post navigation -->
			<p><?php previous_posts_link('Previous Entries' );?>&nbsp;&nbsp;<?php next_posts_link('Older entries' );?></p>
			<?php else: ?>
			<!-- no posts found -->
			<h2>Sorry but we could not find what you were looking </h>
			<?php endif; ?>	
		</div>
		<?php get_sidebar(); ?>
	</div>
</div>
<?php get_footer(); ?>