		<div class="span4 sidebar">
			<h3>My Recent Blogs</h3>
			<?php wp_get_archives(array( 'type' => 'postbypost', 'limit' => 5 ));?>
			<?php wp_loginout(); ?>
			<h3>My Category</h3>
	 		<?php wp_list_categories('title_li=&hide_empty=0'); ?> 
		</div>