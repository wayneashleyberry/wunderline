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

    function affix(scrolled)
    {
        if ($affix_component.length > 0)
        {
            if (scrolled >= affix_offset && scrolled <= (affix_limit_offset - $affix_component.height()))
            {
                $affix_component.addClass('is-fixed');
            }
            else
            {
                $affix_component.removeClass('is-fixed');
            }
        }
    }

    if ($affix_component.length > 0)
    {
        var affix_offset = $affix_component.offset().top;
        var affix_limit_offset = $('footer[role="contentinfo"]').offset().top;

        affix($(window).scrollTop());
    }

    /* ==========================================================================
     * Resize
     * ========================================================================== */

    $(window).on('resize', function () {

        if ($affix_component.length > 0) {
            affix($(window).scrollTop());
        }
    });

    /* ==========================================================================
     * Scroll
     * ========================================================================== */

    $(window).on('scroll', function () {

        if ($affix_component.length > 0) {
            affix($(window).scrollTop());
        }
    });
})();
