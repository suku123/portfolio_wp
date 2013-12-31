<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'myportfolio');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'bGk b0p2={Kj)fhjtR!gO%g!t{QAgwjbwcA#.!=joG!gsj@dy6Ii@E;D.34l90ez');
define('SECURE_AUTH_KEY',  '_u{Z_J<PP}p=hVq.+[`ZQ~=9=,:*8N&uxf57;BGcdi9I]1lcLDyRw?Tuo`Ymc5G<');
define('LOGGED_IN_KEY',    '*;_nZj}M&urp&dV|+|1#p+eeMdiWvsDW1.Cb%Y[ [o>h%>hyJ,l [^ZUk(iBdi5u');
define('NONCE_KEY',        '!YdB}O:^Mgq)*JIWFdWy|EsVC+m9s3c(bSK}p5*6T+YVc{IzYl6]uwPe^WOBM:%T');
define('AUTH_SALT',        'TUEwXu4Q*BcwpBa8Ak,5i2UL^b MzbH9I(Or*U>I3_md6`6HUxLP3zJvuPpqCILM');
define('SECURE_AUTH_SALT', 'q*j0!,$I95>//2CJaU2<0Ho3OK3[`a->@X-sScaf1:R30+zgV$cs2=CyKC2pl{+c');
define('LOGGED_IN_SALT',   '?h[$#2}l](Yt2 _rw@8Fa8][;]~HJb,J}- BS_]pxv{Ja`TBz4HX;<=q#-wp?JQo');
define('NONCE_SALT',       'G]pz&89ut.PWnHiN|<5 6.EuK#2{}G7lz4c:bol&ISUa_IwwT({xp3KuG3vJt-,-');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
