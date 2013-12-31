<?php
/* Template Name: Portfolio
*/
?>
<?php get_header( );?>
				<div class="container">
					<div class="row">
						<div class="span12 span8">
							<div id="contentp">
								<h3>My latest Projects</h3>
								
								<p>Here are my latest projects that you want to know more about them. Hope you are going to like.Please ensure that these are just the demo pictures for the projects.</p>
								
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg">See more</a></p>
								</div>
								
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg">See more</a></p>
								</div>
								
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-3.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-3.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-3.jpg">See more</a></p>
								</div>
								
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-4.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-4.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-4.jpg">See more</a></p>
								</div>
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-1.jpg">See more</a></p>
								</div>
								
								<div class="portfolio-item">
									<a href="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg"><img src="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg" alt="View more info" /></a>
									<p class="btn"><a href="<?php bloginfo('template_directory');?>/img/portfolio-2.jpg">See more</a></p>
								</div>
							</div>
						</div>
						<div class="span12 span4 contents" id="desc">
							 <p><?php if ( have_posts() ) : while ( have_posts() ) : the_post();
								the_content();
								endwhile; endif; ?>
							</p>
						</div>
					</div>
				</div>
				
			</div>
		</div>
<?php get_footer( );?>	