<?php
function add_origem_composta_class_to_body($classes) {
    if (is_page(2592) || is_page(2409) || is_page(2419) || is_page(2645) || is_page(2907) || is_page(2937)) {
        $classes[] = 'origem-composta';
    }
    return $classes;
}
add_filter('body_class', 'add_origem_composta_class_to_body');
?>
