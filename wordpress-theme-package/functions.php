<?php
/**
 * DegreeGate functions and definitions
 *
 * @package degreegate
 */

function degreegate_enqueue_assets() {
    // Locate the built React files dynamically
    // Assumes build assets are moved to theme root /assets after npm run build
    
    $js_files = glob(get_template_directory() . '/assets/*.js');
    $css_files = glob(get_template_directory() . '/assets/*.css');

    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script('degreegate-app', get_template_directory_uri() . '/assets/' . $js_file, array(), '1.0.0', true);
    }

    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style('degreegate-styles', get_template_directory_uri() . '/assets/' . $css_file, array(), '1.0.0');
    }

    // Pass necessary tactical data to the frontend
    wp_localize_script('degreegate-app', 'wpData', array(
        'rootUrl' => get_site_url(),
        'restUrl' => get_rest_url(),
        'nonce'   => wp_create_nonce('wp_rest')
    ));
}
add_action('wp_enqueue_scripts', 'degreegate_enqueue_assets');

// Remove unnecessary WP elements that might interfere with the tactical React layout
function degreegate_clean_header() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'degreegate_clean_header');
