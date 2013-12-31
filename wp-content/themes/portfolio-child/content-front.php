			<div class="span12 span4 contents" id="desc">
				<p><?php if ( have_posts() ) : while ( have_posts() ) : the_post();
					the_content();
					wp_loginout( );
					endwhile; endif; ?>
				</p>
			</div>
		</div>
	</div>
			