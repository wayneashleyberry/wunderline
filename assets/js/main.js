/* ==========================================================================
 * Main JavaScript
 * ========================================================================== */

(function () {

    'use strict';

    /* ==========================================================================
     * Affix
     * ========================================================================== */

    var $affix_component = $('.js-affix');

    /**
     * Fix position the element based on scroll distance from the top of the page
     *
     * @param scrolled
     */

    function affix (scrolled) {
        if ($affix_component.length > 0) {
            if (scrolled >= affix_offset && scrolled <= (affix_limit_offset - $affix_component.height())) {
                $affix_component.addClass('is-fixed');
            }
            else {
                $affix_component.removeClass('is-fixed');
            }
        }
    }

    if ($affix_component.length > 0) {
        var affix_offset = $affix_component.offset().top;
        var affix_limit_offset = $('footer[role="contentinfo"]').offset().top;

        affix($(window).scrollTop());
    }

    /* ==========================================================================
     * Navigation Highlight
     * ========================================================================== */

    var $nav_highlight = $('.js-nav-highlight');

    if ($nav_highlight.length > 0) {
        var $nav_anchors = $('li a', $nav_highlight);
        var sections = [];

        /**
         * Populate an array with all the sections in the navigation
         */

        for (var a = 0; a < $nav_anchors.length; a++) {
            sections.push($($nav_anchors[a]).attr('href'));
        }

        /**
         * Scroll to section based on navigation
         */

        $nav_anchors.on('click', function (e) {
            e.preventDefault();

            var href = $(this).attr('href');

            $('html, body').animate({
                scrollTop: $(href).offset().top
            });

            if (history.pushState) {
                history.pushState(null, document.title, href);
            }
        });
    }

    /**
     * Highlight the current section’s navigation item
     *
     * @param scrolled
     */

    function navHighlight (scrolled) {
        for (var b = 0; b < sections.length; b++) {
            var id = sections[b];
            var section_offset_top = $(id).offset().top - $nav_highlight.outerHeight(true);
            var section_height = $(id).outerHeight(true);
            var nav_list_item = $('a[href="' + id + '"]').parent();

            if (scrolled >= section_offset_top && scrolled < (section_offset_top + section_height)) {
                nav_list_item.addClass('is-current');
            }
            else {
                nav_list_item.removeClass('is-current');
            }
        }
    }

    /* ==========================================================================
     * Typed
     * ========================================================================== */

    var $typed = $('.js-typed');

    if ($typed.length > 0) {
        $typed.typed({
            strings: [$typed.data('typed-string')],
            typeSpeed: 50
        });
    }

    /* ==========================================================================
     * Resize
     * ========================================================================== */

    $(window).on('resize', function () {

        if ($affix_component.length > 0) {
            affix($(window).scrollTop());
        }

        if ($nav_highlight.length > 0) {
            navHighlight($(window).scrollTop());
        }
    });

    /* ==========================================================================
     * Scroll
     * ========================================================================== */

    $(window).on('scroll', function () {

        if ($affix_component.length > 0) {
            affix($(window).scrollTop());
        }

        if ($nav_highlight.length > 0) {
            navHighlight($(window).scrollTop());
        }
    });
})();
