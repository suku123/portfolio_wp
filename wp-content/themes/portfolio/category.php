 <?php get_header(); ?>
 <div class="container">
 	<div class="row">
 		<div class="span12 span8 blogpage">
			 <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
			 <div class="post-content">
				 <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
				 <?php the_time('F jS, Y') ?> by <?php the_author_posts_link() ?>
				 <?php the_content(); ?>
			</div>	 
			 <?php endwhile; ?>
				<p><?php previous_posts_link('Previous Entries' );?>&nbsp;&nbsp;<?php next_posts_link('Older entries' );?></p>
			<?php else: ?>
			 <p>Sorry, no posts matched your criteria.</p>

			 <?php endif; ?>
		</div>
		<?php get_sidebar( ); ?>	 
	 </div>
 </div>
 <?php get_footer(); ?>