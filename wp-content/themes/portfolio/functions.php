
<?php 
register_nav_menu( 'primary', 'Primary Menu' );

add_theme_support( 'post-thumbnails' ); 

register_sidebar( array (
'name' => __('Facebook Home Page', 'blankslate'),
'id' => 'facebook-widget-area',
'before_widget' => '<li id="%1$s" class="widget-container-facebook %2$s">',
'after_widget' => "</li>",
'before_title' => '<h3 class="facebook-widget-title">',
'after_title' => '</h3>',
) );

//**Custom Gravatar**//
add_filter( 'avatar_defaults', 'new_custom_default_gravatar' );
function new_custom_default_gravatar ($avatar_defaults) {
$myavatar = get_bloginfo('template_directory') . '/img/suku.jpg';
$avatar_defaults[$myavatar] = "Custom Default Gravatar";
return $avatar_defaults;
}

