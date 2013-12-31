<?php get_header(); ?>
<div class="container clearfix">
	<div class="row">
		<div class="span12">
			<div class="span8 single-post">
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<!-- post -->
				<h2><?php the_title(); ?></h2>
				<div class="single-entry">
					<em>Article Posted on:<?php the_time('l,F,jS,Y'); ?>at <?php the_time( ); ?></em>
					<?php the_content( ); ?>
					<?php the_tags( ); ?>
					<div class="promote">
						<h3>Enjoy the Article</h3>
						<p>If you have enjoy this article please subscribe to our <a href="<?php bloginfo('rss2_url'); ?>">RSS Feed</a></p>	
					</div>
					<br>

					<?php comments_template( ); ?>

					<div class="postlink">
						<p><?php previous_post_link('%link &laquo;' );?>&nbsp;&nbsp;<?php next_post_link('&raquo; %link' );?></p>
					</div>
				</div>		
				<?php endwhile; ?>
				<!-- post navigation -->
				
				<?php else: ?>
				<!-- no posts found -->
				<h2>Sorry no post found</h2>
				<?php endif; ?>	
			</div>
			<?php get_sidebar(); ?>
		</div>	
	</div>
</div>
<?php get_footer(); ?>