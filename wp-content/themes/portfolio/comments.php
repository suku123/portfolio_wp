<?php if(!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME'])) : ?>  	
	<?php die('You can not access this page directly!'); ?>  
<?php endif; ?>

<?php if(!empty($post->post_password)) : ?>
  	<?php if($_COOKIE['wp-postpass_' . COOKIEHASH] != $post->post_password) : ?>
		<p>This post is password protected. Enter the password to view comments.</p>
  	<?php endif; ?>
<?php endif; ?>

<?php if($comments) : ?>
  	<ol class="commentlist">
    	<?php comments_popup_link('No comments', 'One comment', '% comments', 'comments-link', 'Comments are closed'); ?>
    	<?php $i = 0; ?>
    	<?php foreach($comments as $comment) : ?>
  			<?php if ($comment->comment_approved == '0') : ?>
  				<p>Your comment is awaiting approval</p>
  			<?php endif; ?>
  			<?php $i++; ?>
  			<li id="comment-<?php comment_ID() ?>"
			    <?php if($i&1) { 
			        echo 'class="odd"';
			    } 
			    else {
			        echo 'class="even"';
			    } ?>>
			    <header class="comment-header">
	  				<?php echo get_avatar( $comment, 50 ); ?>  
	  			</header>
	  			<?php comment_text(); ?>  
	  			<p class="meta"><?php comment_type(); ?> by <?php comment_author_link(); ?> on <?php comment_date(); ?> at <?php comment_time(); ?></p>
	  			<?php edit_comment_link($link_text, $before_link, $after_link); ?>
  			</li>
  		<br>
		<?php endforeach; ?>
	</ol>
	 <div class="paginate-com">
	    <?php
	    //Create pagination links for the comments on the current post.
	    paginate_comments_links( array('prev_text' => '&lsaquo; Previous', 'next_text' => 'Next &rsaquo;'));
	    ?>
	</div>
<?php else : ?>
	<p>No comments yet</p>
<?php endif; ?>

<?php if(comments_open()) : ?>
	<?php if(get_option('comment_registration') && !$user_ID) : ?>
		<p>You must be <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?redirect_to=<?php echo urlencode(get_permalink()); ?>">logged in</a> to post a comment.</p><?php else : ?>
		<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">
			<?php if($user_ID) : ?>
				<p>Logged in as <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?action=logout" title="Log out of this account">Log out &raquo;</a></p>
			<?php else : ?>
				<p><input type="text" name="author" id="author" value="<?php echo $comment_author; ?>" size="22" tabindex="1" />
				<label for="author"><small>Name <?php if($req) echo "(required)"; ?></small></label></p>
				<p><input type="text" name="email" id="email" value="<?php echo $comment_author_email; ?>" size="22" tabindex="2" />
				<label for="email"><small>Mail (will not be published) <?php if($req) echo "(required)"; ?></small></label></p>
				<p><input type="text" name="url" id="url" value="<?php echo $comment_author_url; ?>" size="22" tabindex="3" />
				<label for="url"><small>Website</small></label></p>
			<?php endif; ?>
			Allowed tags: <?php echo allowed_tags(); ?>
			<p><textarea name="comment" id="comment" cols="100%" rows="10" tabindex="4"></textarea></p>
			<p><input name="submit" type="submit" id="submit" tabindex="5" value="Submit Comment" />
			<input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>" /></p>
			<?php do_action('comment_form', $post->ID); ?> 
		</form>
	<?php endif; ?>
<?php else : ?>
	<p>The comments are closed.</p>
<?php endif; ?>
<p><?php previous_posts_link('Previous Entries' );?>&nbsp;&nbsp;<?php next_posts_link('Older entries' );?></p>

